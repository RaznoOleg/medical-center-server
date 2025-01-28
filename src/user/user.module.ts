import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { userPhotoMulterConfig } from 'src/configurations/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        userPhotoMulterConfig(configService)
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
