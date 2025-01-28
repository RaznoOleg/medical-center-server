import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/common/enums';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  IsEnum,
  IsISO31661Alpha2,
  IsOptional,
  IsEmpty
} from 'class-validator';
import {
  ADDRESS_REGEX,
  CITY_REGEX,
  DATE_REGEX,
  NAME_MIN_LENGTH
} from 'src/common/consts';

export default class CreatePatientDto {
  @ApiProperty({
    description: 'Patient first name',
    example: 'John'
  })
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH)
  firstName: string;

  @ApiProperty({
    description: 'Patient last name',
    example: 'Nedoe'
  })
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH)
  lastName: string;

  @ApiProperty({
    description: "Patient's phone ",
    example: '+380992598283'
  })
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: "Patient's email",
    example: 'john_nedoe@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Patient's gender",
    example: 'Male'
  })
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    description: "Patient's birthday",
    example: '2000-10-10'
  })
  @IsOptional()
  birthDate?: string;

  @ApiProperty({
    description: "Patient's country",
    example: 'DE'
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: "Patient's city",
    example: 'Berlin'
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: "Patient's address",
    example: 'Berger Str. 22'
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: "Patient's overview",
    example: 'Some issue'
  })
  @IsString()
  @IsOptional()
  overview?: string;
}
