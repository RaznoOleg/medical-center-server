import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export default class RefreshTokenDto {
  @ApiProperty({
    description: 'JwtToken',
    example:
      'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxiV0ZwYkNJNkluSmhlbTV2TG05c1pXZEFaMjFoYVd3dVkyOXRJaXdpYzNWaUlqbzNMQ0pwWVhRaU9qRTNNRGs0TmpBd05UWXNJbVY0Y0NJNk1UY3dPVGswTmpRMU5uMC51ZmtQYkh0d19HdU9laW9XVjF3NFgxR2l0SVZ5Njl6eXBFZ2dRa1J2OWpF'
  })
  @IsString()
  @IsNotEmpty()
  tokenToRefresh: string;
}
