import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class SendEmailDto {
  @ApiProperty({
    description: "Doctor's email",
    example: 'john_doe@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Activation/reset password link',
    example:
      'http://localhost:3000/auth/activation/3b94dc94-822e-49a5-a589-a3f616288ec3'
  })
  @IsString()
  @IsNotEmpty()
  link: string;
}
