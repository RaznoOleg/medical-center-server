import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  Session,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateUserDto from 'src/user/dto/create-user.dto';
import User from 'src/user/entities/user.entity';
import { GoogleUserDetails, UserInfo } from 'src/common/types';
import SignInDto from 'src/auth/dto/sign-in.dto';
import ForgotPasswordDto from 'src/auth/dto/forgot-password.dto';
import ResetPasswordDto from 'src/auth/dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import RefreshTokenDto from './dto/refresh-token.dto';
import CheckEmailDto from './dto/check-email.dto';
import { GoogleOauthGuard } from './guards/google-auth.guard';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @ApiOperation({ summary: 'Doctor registration' })
  @ApiResponse({ status: 201, type: User })
  @Post('/sign-up')
  async signUp(
    @Body() createUserDto: CreateUserDto
  ): Promise<{ accessToken: string; newUser: UserInfo }> {
    return await this.authService.signUp(createUserDto);
  }

  @ApiOperation({ summary: 'Doctor login' })
  @ApiResponse({ status: 201, type: User })
  @Post('/sign-in')
  async signIn(
    @Body() userDto: SignInDto
  ): Promise<{ accessToken: string; user: UserInfo }> {
    return this.authService.signIn(userDto);
  }

  @ApiOperation({ summary: 'Login with Google OAuth' })
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<{ msg: string }> {
    return { msg: 'Google Authentication' };
  }

  @ApiOperation({ summary: 'Google OAuth callback endpoint' })
  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    if (!user.accessToken) {
      const { userInfoToken } = await this.authService.generateUserInfoToken(
        user.userInfo
      );
      res.redirect(
        `${this.configService.get('client_url_google_sign_up')}?userInfo=${userInfoToken}`
      );
    } else {
      res.redirect(
        `${this.configService.get('client_url_google_redirect')}?gtoken=${user.accessToken}`
      );
    }
  }

  @Get('/second-form')
  async secondForm(@Session() session, @Res() res: Response) {
    const user = session.user;
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User data not found in session' });
    }

    delete session.user;

    res.status(200).json(user);
  }

  @ApiOperation({ summary: 'Update doctor activation link' })
  @ApiResponse({ status: 201, type: User })
  @Patch('/activation/link/user/:id')
  async updateActivationLink(@Param('id') id: number): Promise<UserInfo> {
    return this.authService.updateActivationLink(id);
  }

  @ApiOperation({ summary: 'Account verification' })
  @ApiResponse({ status: 201, type: User })
  @Get('/verification/:link')
  async verifyAccount(@Param('link') link: string): Promise<void> {
    return this.authService.verifyAccount(link);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: 201, type: User })
  @Post('/forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, type: User })
  @Patch('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({ status: 200, type: String })
  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @ApiOperation({ summary: 'Check doctor email' })
  @ApiResponse({ status: 201, type: User })
  @Post('/check-email')
  async checkEmail(@Body() doctorDto: CheckEmailDto): Promise<void> {
    return this.authService.checkEmail(doctorDto);
  }
}
