import { MulterModuleOptions } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as uuid from 'uuid';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const noteFileMulterConfig = (
  configService: ConfigService
): MulterModuleOptions => ({
  storage: diskStorage({
    destination: `.${configService.get<string>('file_uploads_destination')}`,
    filename: (req, file, cb) => {
      const { originalname } = file;
      const extension: string = originalname.split('.').pop();
      const filename: string = uuid.v4();
      cb(null, `${filename}.${extension}`);
    }
  })
});

export const userPhotoMulterConfig = (
  configService: ConfigService
): MulterModuleOptions => ({
  storage: diskStorage({
    destination: `.${configService.get<string>('photo_uploads_destination')}`,
    filename: (req, file, cb) => {
      const { originalname } = file;
      const extension: string = originalname.split('.').pop().toLowerCase();
      const filename: string = uuid.v4();
      cb(null, `${filename}.${extension}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['png', 'jpeg', 'gif', 'jpg'];
    const extension = file.originalname.split('.').pop().toLowerCase();
    const isAllowed = allowedExtensions.includes(extension);

    if (!isAllowed) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  }
});
