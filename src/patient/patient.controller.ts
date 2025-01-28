import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import Patient from './entities/patient.entity';
import CreatePatientDto from './dto/create-patient.dto';
import UpdatePatientDto from './dto/update-patient.dto';
import CheckPatientEmailDto from './dto/check-patient-email.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Patient')
@ApiBearerAuth('access-token')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Create patient' })
  @ApiResponse({ status: 201, type: Patient })
  @Post()
  createPatient(@Body() patientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.createPatient(patientDto);
  }

  @ApiOperation({ summary: 'Update info about patient' })
  @ApiResponse({ status: 200, type: Patient })
  @Patch('/:id')
  updatePatient(
    @Param('id') id: number,
    @Body() patientDto: UpdatePatientDto
  ): Promise<Patient> {
    return this.patientService.updatePatient(id, patientDto);
  }

  @ApiOperation({ summary: 'Getting all patients' })
  @ApiResponse({ status: 200, type: [Patient] })
  @Get()
  getAllPatients(): Promise<Patient[]> {
    return this.patientService.getAllPatients();
  }

  @ApiOperation({ summary: 'Getting a patient by ID' })
  @ApiResponse({ status: 200, type: Patient })
  @Get('/:id')
  getPatientById(@Param('id') id: number): Promise<Patient> {
    return this.patientService.getPatientById(id);
  }

  @ApiOperation({ summary: 'Check patient email' })
  @ApiResponse({ status: 201, type: Patient })
  @Post('/check-email')
  async checkEmail(@Body() patientDto: CheckPatientEmailDto): Promise<void> {
    return this.patientService.checkEmail(patientDto);
  }
}
