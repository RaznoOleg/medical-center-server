import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Text of the note',
    example: 'Patient has pain'
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'User Id',
    example: '1'
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    description: 'Patient Id',
    example: '1'
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  patientId: number;
}
