import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class CheckPatientEmailDto {
  @ApiProperty({
    description: "Patient's email",
    example: 'john_doe@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
