import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateVitalsDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the patient to whom these vitals belong'
  })
  @IsInt()
  patientId: number;

  @ApiProperty({
    example: 120,
    description: 'Systolic blood pressure (mmHg)'
  })
  @IsNumber()
  @Min(50)
  @Max(250)
  systolic: number;

  @ApiProperty({
    example: 80,
    description: 'Diastolic blood pressure (mmHg)'
  })
  @IsNumber()
  @Min(30)
  @Max(150)
  diastolic: number;

  @ApiProperty({
    example: 5.6,
    description: 'Blood glucose level (mmol/L)'
  })
  @IsNumber()
  @Min(1)
  @Max(30)
  glucose: number;

  @ApiProperty({
    example: 72,
    description: 'Heart rate (beats per minute)'
  })
  @IsNumber()
  @Min(30)
  @Max(250)
  pulse: number;

  @ApiProperty({
    example: '2025-10-26T12:00:00Z',
    description: 'Timestamp of measurement (ISO format)',
    required: false
  })
  @IsOptional()
  measurementTime?: Date;
}
