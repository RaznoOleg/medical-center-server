import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Note from './entities/note.entity';
import { PatientModule } from 'src/patient/patient.module';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { noteFileMulterConfig } from 'src/configurations/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    UserModule,
    ConfigModule,
    PatientModule,
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        noteFileMulterConfig(configService)
    })
  ],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService]
})
export class NoteModule {}
