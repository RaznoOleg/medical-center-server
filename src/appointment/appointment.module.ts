import { Module, forwardRef } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Appointment from './entities/appointment.entity';
import { UserModule } from 'src/user/user.module';
import { PatientModule } from 'src/patient/patient.module';
import { AvailabilityModule } from 'src/availability/availability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    UserModule,
    PatientModule,
    forwardRef(() => AvailabilityModule)
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService]
})
export class AppointmentModule {}
