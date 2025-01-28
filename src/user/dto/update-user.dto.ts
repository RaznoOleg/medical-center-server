import { OmitType, PartialType } from '@nestjs/swagger';
import CreateUserDto from './create-user.dto';

export default class UpdateUserDto extends OmitType(
  PartialType(CreateUserDto),
  ['password']
) {}
