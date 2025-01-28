import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateAppointmentDto {
  @ApiProperty({
    example: '2024-03-25T09:00:00',
    description: 'Start Time',
    type: String,
    format: 'date-time'
  })
  startTime: Date;

  @ApiProperty({
    example: '2024-03-25T10:00:00',
    description: 'End Time',
    type: String,
    format: 'date-time'
  })
  endTime: Date;

  @ApiProperty({
    description: 'User Id',
    example: '1'
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Patient Id',
    example: '1'
  })
  @IsNotEmpty()
  @IsNumber()
  patientId: number;
}
