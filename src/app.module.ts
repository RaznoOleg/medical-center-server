import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations from './configurations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configurations/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './auth/mailer/mail.module';
import { PatientModule } from './patient/patient.module';
import { NoteModule } from './note/note.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    MailModule,
    PatientModule,
    NoteModule,
    AvailabilityModule,
    AppointmentModule
  ]
})
export class AppModule {}
