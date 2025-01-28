import { Module, forwardRef } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Availability from './entities/availability.entity';
import { UserModule } from 'src/user/user.module';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Availability]),
    UserModule,
    AppointmentModule
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService]
})
export class AvailabilityModule {}
