import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpCode
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import CreateAppointmentDto from './dto/create-appointment.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import Appointment from './entities/appointment.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IUserRequest } from 'src/common/types';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @ApiOperation({ summary: 'Create appointment' })
  @ApiResponse({ status: 201, type: Appointment })
  @Post()
  createAppointment(
    @Body() appointmentDto: CreateAppointmentDto
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(appointmentDto);
  }

  @ApiOperation({ summary: 'Getting all doctor appointments' })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/user/:id')
  getAllAppointmentsByUserId(
    @Param('id') userId: number
  ): Promise<Appointment[]> {
    return this.appointmentService.getAllAppointmentsByUserId(userId);
  }

  @ApiOperation({ summary: 'Getting an appointment by ID' })
  @ApiResponse({ status: 200, type: Appointment })
  @Get('/:id')
  getAppointmentById(@Param('id') id: number): Promise<Appointment> {
    return this.appointmentService.getAppointmentById(id);
  }

  @ApiOperation({ summary: 'Delete patient appointment' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Delete('/:id')
  deleteAppointmentById(@Param('id') id: number): Promise<void> {
    return this.appointmentService.deleteAppointmentById(id);
  }

  @ApiOperation({ summary: 'Getting all patient appointments' })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/patient/:id')
  getAllAppointmentsByPatientId(
    @Param('id') patientId: number
  ): Promise<Appointment[]> {
    return this.appointmentService.getAllAppointmentsByPatientId(patientId);
  }

  @ApiOperation({ summary: `Getting all of today's doctor's appointments` })
  @ApiResponse({ status: 200, type: [Appointment] })
  @Get('/today/user/:id')
  getAllTodayAppointmentsByUserId(
    @Param('id') userId: number
  ): Promise<Appointment[]> {
    return this.appointmentService.getAllTodayAppointmentsByUserId(userId);
  }
}
