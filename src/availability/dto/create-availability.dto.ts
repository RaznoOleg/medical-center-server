import { ApiProperty } from '@nestjs/swagger';

export default class CreateAvailabilityDto {
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
}
