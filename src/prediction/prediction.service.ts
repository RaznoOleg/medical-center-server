import axios from 'axios';
import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PredictionDto } from './dto/prediction.dto';
import { Prediction } from './entities/prediction.entity';
import { VitalsService } from 'src/vitals/vitals.service';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class PredictionService {
  private readonly pythonBaseUrl: string;
  private readonly windowSize: number;

  constructor(
    @InjectRepository(Prediction)
    private predictionRepository: Repository<Prediction>,
    private readonly configService: ConfigService,
    private readonly vitalsService: VitalsService,
    private readonly patientService: PatientService
  ) {
    this.pythonBaseUrl = this.configService.get<string>(
      'risk_prediction_api_url'
    );
    this.windowSize = this.configService.get<number>('window_size') ?? 15;
  }

  async predict(predictionDto: PredictionDto) {
    const lastReadings = await this.vitalsService.getLastVitalsByPatientId(
      predictionDto.patientId,
      this.windowSize
    );

    if (lastReadings.length < this.windowSize) {
      throw new HttpException(
        `Not enough vitals for prediction (need ${this.windowSize} entries)`,
        HttpStatus.BAD_REQUEST
      );
    }

    const windowMatrix = lastReadings
      .map((reading) => [
        reading.systolic,
        reading.diastolic,
        reading.glucose,
        reading.pulse
      ])
      .reverse();

    const response = await axios.post(`${this.pythonBaseUrl}/predict`, {
      window: windowMatrix
    });

    const result = response.data;

    const record = this.predictionRepository.create({
      patientId: predictionDto.patientId,
      riskProbability: result.risk_probability,
      riskLevel: result.risk_level,
      estimatedDaysUntilComplication: result.estimated_days_until_complication,
      summary: result.summary
    });

    await this.predictionRepository.save(record);

    return result;
  }

  async getPredictions(patientId: number) {
    const patient = await this.patientService.getPatientById(patientId);

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    return this.predictionRepository.find({
      where: { patientId: patientId },
      order: { createdAt: 'DESC' }
    });
  }
}
