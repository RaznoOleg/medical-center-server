import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class CheckEmailDto {
  @ApiProperty({
    description: "Doctor's email",
    example: 'john_doe@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
