import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vitals } from './entities/vitals.entity';
import { VitalsController } from './vitals.controller';
import { VitalsService } from './vitals.service';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vitals]), PatientModule],
  controllers: [VitalsController],
  providers: [VitalsService],
  exports: [VitalsService]
})
export class VitalsModule {}
