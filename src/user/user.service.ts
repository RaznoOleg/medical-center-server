import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import { UserInfo } from 'src/common/types';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...createUserDto })
        .execute();

      return newUser.generatedMaps[0] as User;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(userId: number, userDto: Partial<User>): Promise<UserInfo> {
    try {
      const user = await this.getUserById(userId);

      Object.assign(user, userDto);

      const updateUser = await this.save(user);
      const { password, activationLink, ...userInfo } = updateUser;
      return userInfo;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(): Promise<UserInfo[]> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .getMany();
      return users;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsersBySpec(specialization: number): Promise<UserInfo[]> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.specialization = :specialization', { specialization })
        .getMany();
      return users;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(userId: number): Promise<UserInfo | null> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: userId }
      });
      const { password, activationLink, ...userInfo } = user;
      return userInfo;
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('user.password')
        .getOne();

      if (!user) return null;
      return user;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(payload: { email: string }): Promise<UserInfo> {
    try {
      const user = await this.getUserByEmail(payload.email);
      if (!user) throw new UnauthorizedException('User not found!');
      const { password, ...userData } = user;

      return userData;
    } catch (error) {
      throw new UnauthorizedException('User will not found!');
    }
  }

  async updateUserPhoto(
    userId: number,
    userPhoto: Express.Multer.File
  ): Promise<void> {
    try {
      const user = await this.getUserById(userId);

      const photoUrl = `${this.configService.get(
        'api_url'
      )}/user/photo/${user.id}/${userPhoto.filename}`;

      user.photoUrl = photoUrl;

      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserPhotoFileByIdAndFilename(
    userId: number,
    filename: string,
    res: Response
  ): Promise<void> {
    try {
      const user = await this.getUserById(userId);

      if (!user.photoUrl) {
        throw new NotFoundException(
          `User with ID ${userId} does not have a photo`
        );
      }

      const photoPath = `.${this.configService.get(
        'photo_uploads_destination'
      )}/${filename}`;
      if (!fs.existsSync(photoPath) || !user.photoUrl.includes(filename)) {
        throw new NotFoundException('Photo file for user not found');
      }

      const fileStream = fs.createReadStream(photoPath);

      fileStream.pipe(res);
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async save(user: UserInfo) {
    return this.userRepository.save(user);
  }
}
