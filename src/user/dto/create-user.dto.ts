import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '../../common/enums';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  IsEnum,
  IsISO31661Alpha2,
  IsNumber,
  IsOptional
} from 'class-validator';
import {
  NAME_MIN_LENGTH,
  PASSWORD_REGEX,
  CITY_REGEX,
  ADDRESS_REGEX,
  DATE_REGEX
} from '../../common/consts';

export default class CreateUserDto {
  @ApiProperty({
    description: 'Doctor first name',
    example: 'John'
  })
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH)
  firstName: string;

  @ApiProperty({
    description: 'Doctor last name',
    example: 'Doe'
  })
  @IsString()
  @IsNotEmpty()
  @Length(NAME_MIN_LENGTH)
  lastName: string;

  @ApiProperty({
    description: "Doctor's phone ",
    example: '+380992598283'
  })
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: "Doctor's email",
    example: 'john_doe@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
  @IsOptional()
  password: string | null;

  @ApiProperty({
    description: "Doctor's specialization",
    example: 0
  })
  @IsNumber()
  specialization: number;

  @ApiProperty({
    description: "Doctor's gender",
    example: 'Male'
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: "Doctor's birthday",
    example: '20/10/1980'
  })
  @Matches(DATE_REGEX, {
    message: 'Invalid date type'
  })
  birthDate: string;

  @ApiProperty({
    description: "Doctor's country",
    example: 'DE'
  })
  @IsISO31661Alpha2()
  @IsString()
  country: string;

  @ApiProperty({
    description: "Doctor's city",
    example: 'Frankfurt'
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: "Doctor's address",
    example: 'Berger Str. 22'
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: "Doctor's role",
    example: 'Local'
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role: string;

  @ApiProperty({
    description: "Doctor's photo",
    example: ''
  })
  photoUrl: string;
}
