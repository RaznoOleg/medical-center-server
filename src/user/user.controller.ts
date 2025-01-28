import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import User from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import UpdateUserDto from './dto/update-user.dto';
import { IUserRequest, UserInfo } from 'src/common/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserPhotoSchema } from 'src/common/swagger-schemas';
import { Response } from 'express';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update info about doctor' })
  @ApiResponse({ status: 200, type: User })
  @Patch('/update')
  updateUser(
    @Req() req: IUserRequest,
    @Body() userDto: UpdateUserDto
  ): Promise<UserInfo> {
    return this.userService.updateUser(req.user?.id, userDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Getting all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAllUsers(): Promise<UserInfo[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Getting all users by specialization' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('/:specialization')
  getAllUsersBySpec(
    @Param('specialization') specialization: number
  ): Promise<UserInfo[]> {
    return this.userService.getAllUsersBySpec(specialization);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Getting a user by ID' })
  @ApiResponse({ status: 200, type: User })
  @Get('/:id')
  getUserById(@Param('id') id: number): Promise<UserInfo> {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload user photo' })
  @ApiResponse({ status: 200, type: User })
  @Patch('/update-photo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiBody({ schema: UpdateUserPhotoSchema })
  uploadUserPhoto(
    @Req() req: IUserRequest,
    @UploadedFile() photo: Express.Multer.File
  ): Promise<void> {
    if (!photo) {
      throw new HttpException(
        `File extension not allowed`,
        HttpStatus.BAD_REQUEST
      );
    }
    return this.userService.updateUserPhoto(req.user?.id, photo);
  }

  @ApiOperation({ summary: 'Get user photo' })
  @ApiResponse({ status: 200, type: File })
  @Get('/photo/:id/:filename')
  async getUserPhotoFileByIdAndFilename(
    @Param('id') id: number,
    @Param('filename') filename: string,
    @Res() res: Response
  ): Promise<void> {
    return this.userService.getUserPhotoFileByIdAndFilename(id, filename, res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Request user profile' })
  @ApiResponse({ status: 200, type: User })
  @Get('/profile/info')
  async getUser(@Req() req: IUserRequest): Promise<UserInfo> {
    const user = await this.userService.getUser({ email: req.user?.email });
    return user;
  }
}
