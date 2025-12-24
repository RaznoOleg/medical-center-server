import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PredictionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsNumber()
  patientId: number;
}
