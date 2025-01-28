import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/common/consts';

export default class ResetPasswordDto {
  @ApiProperty({
    description: 'JwtToken',
    example:
      'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxiV0ZwYkNJNkluSmhlbTV2TG05c1pXZEFaMjFoYVd3dVkyOXRJaXdpYzNWaUlqbzNMQ0pwWVhRaU9qRTNNRGs0TmpBd05UWXNJbVY0Y0NJNk1UY3dPVGswTmpRMU5uMC51ZmtQYkh0d19HdU9laW9XVjF3NFgxR2l0SVZ5Njl6eXBFZ2dRa1J2OWpF'
  })
  @IsString()
  @IsNotEmpty()
  encodedToken: string;

  @ApiProperty({
    description: "Doctor's password",
    example: '11111111Qq'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password should contain 10 characters, at least one uppercase and one lowercase letter'
  })
  password: string;
}
