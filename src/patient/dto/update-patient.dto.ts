import { PartialType } from '@nestjs/swagger';
import CreatePatientDto from './create-patient.dto';

export default class UpdatePatientDto extends PartialType(CreatePatientDto) {}
