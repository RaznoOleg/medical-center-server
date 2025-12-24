import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { VitalsModule } from 'src/vitals/vitals.module';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction]),
    VitalsModule,
    PatientModule
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
  exports: [PredictionService]
})
export class PredictionModule {}
