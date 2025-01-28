import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import CreateUserDto from 'src/user/dto/create-user.dto';
import User from 'src/user/entities/user.entity';
import { HASH_SALT } from 'src/common/consts';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import base64url from 'base64url';
import SignInDto from 'src/auth/dto/sign-in.dto';
import { GoogleUserDetails, UserInfo } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';
import MailService from './mailer/mail.service';
import ForgotPasswordDto from 'src/auth/dto/forgot-password.dto';
import ResetPasswordDto from 'src/auth/dto/reset-password.dto';
import { Session } from 'inspector';
import RefreshTokenDto from './dto/refresh-token.dto';
import CheckEmailDto from './dto/check-email.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(
    userDto: CreateUserDto,
    googleUser: GoogleUserDetails
  ): Promise<{ accessToken: string; newUser: UserInfo }> {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (user) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT
      );
    }

    const hashPassword = await this.hashPassword(userDto.password);
    const newUser = await this.userService.createUser({
      ...userDto,
      password: hashPassword
    });

    const { accessToken } = await this.generateToken(newUser);

    if (!googleUser) {
      const userWithLink = await this.updateActivationLink(newUser.id);

      return { accessToken: accessToken, newUser: userWithLink };
    }

    return { accessToken: accessToken, newUser };
  }

  async signIn(
    signInDto: SignInDto
  ): Promise<{ accessToken: string; user: UserInfo }> {
    try {
      const user = await this.validateUser(signInDto);
      const { accessToken } = await this.generateToken(user);

      return { accessToken, user };
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      if (password) {
        return await bcrypt.hash(password, HASH_SALT);
      }
      return null;
    } catch (error) {
      throw new Error('Failed to hash the password');
    }
  }

  private async validateUser(userDto: SignInDto): Promise<UserInfo> {
    try {
      const user = await this.userService.getUserByEmail(userDto.email);

      if (!user) {
        throw new HttpException(
          `Wrong email!`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      const passwordValid = await bcrypt.compare(
        userDto.password,
        user.password
      );
      if (!passwordValid) {
        throw new HttpException(
          `Wrong password`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const { activationLink, password, ...userInfo } = user;
      return userInfo;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async generateToken(
    user: UserInfo
  ): Promise<{ accessToken: string }> {
    try {
      const payload = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload)
      };
    } catch (error) {
      throw new HttpException(
        'Unpossible to generate token',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async refreshToken(
    tokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string }> {
    try {
      const decodedToken = this.jwtService.decode(tokenDto.tokenToRefresh);

      if (!decodedToken) {
        throw new HttpException('Invalid access token', HttpStatus.CONFLICT);
      }

      const user = await this.userService.getUserById(decodedToken.sub);

      if (user) {
        const payload = { email: user.email, sub: user.id };
        return {
          accessToken: this.jwtService.sign(payload, {
            expiresIn: this.configService.get('jwt_expiration_time')
          })
        };
      }
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateActivationLink(id: number): Promise<UserInfo> {
    try {
      const user = await this.userService.getUserById(id);
      const activationLink = uuid.v4();

      const updatedUser = await this.userService.updateUser(user.id, {
        activationLink: `${this.configService.get(
          'client_url'
        )}/activation/${activationLink}`
      });

      await this.mailService.sendActivationMail({
        email: user.email,
        link: `${this.configService.get(
          'client_url'
        )}/activation/${activationLink}`
      });

      return await this.userRepository.save(updatedUser);
    } catch (error) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.CONFLICT
      );
    }
  }

  async verifyAccount(link: string): Promise<void> {
    try {
      const activationLink = `${this.configService.get(
        'client_url'
      )}/activation/${link}`;

      const user = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ isVerified: true })
        .where('activationLink = :activationLink', { activationLink })
        .execute();

      if (!user.affected) {
        throw new HttpException(
          'Wrong activation link',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new HttpException(
        'Wrong activation link',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.getUserByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new HttpException(`Wrong email!`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const { accessToken } = await this.generateToken(user);

    const encodedToken = base64url.encode(accessToken);

    const forgotLink = `${this.configService.get(
      'client_url'
    )}/reset-pass/${encodedToken}`;

    try {
      await this.mailService.sendChangePasswordMail({
        email: user.email,
        link: forgotLink
      });
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      const { password, encodedToken } = resetPasswordDto;
      const decodedToken = base64url.decode(encodedToken);

      const verifiedUser = await this.jwtService.verify(decodedToken);
      const newPassword = await this.hashPassword(password);

      const user = await this.userService.getUserByEmail(verifiedUser.email);
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: newPassword })
        .where('email = :email', { email: user.email })
        .execute();
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateGoogleUser(details: GoogleUserDetails): Promise<{
    userInfo: UserInfo | GoogleUserDetails;
    accessToken?: string;
  }> {
    const user = await this.userService.getUserByEmail(details.email);

    if (user) {
      const { accessToken } = await this.generateToken(user);
      const { password, ...userInfo } = user;
      return { accessToken, userInfo };
    }

    const googleUserData = {
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      isVerified: details.isVerified,
      photoUrl: details.photoUrl
    };

    return { userInfo: googleUserData };
  }

  async checkEmail(userDto: CheckEmailDto): Promise<void> {
    const doctor = await this.userService.getUserByEmail(userDto.email);
    if (doctor) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT
      );
    }
  }

  async generateUserInfoToken(
    user: UserInfo
  ): Promise<{ userInfoToken: string }> {
    try {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        photoUrl: user.photoUrl
      };
      return {
        userInfoToken: this.jwtService.sign(payload)
      };
    } catch (error) {
      throw new HttpException(
        'Unpossible to generate token',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
