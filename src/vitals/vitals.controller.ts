import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ValidationPipe,
  HttpCode
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';
import { VitalsService } from './vitals.service';
import { CreateVitalsDto } from './dto/create-vitals.dto';
import { UpdateVitalsDto } from './dto/update-vitals.dto';
import { Vitals } from './entities/vitals.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('Vitals')
@ApiBearerAuth('access-token')
@Controller('vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @ApiOperation({ summary: 'Create new patient vital record' })
  @ApiResponse({ status: 201, type: Vitals })
  @Post()
  create(@Body(new ValidationPipe()) dto: CreateVitalsDto) {
    return this.vitalsService.create(dto);
  }

  @ApiOperation({ summary: 'Update patient vital record' })
  @ApiResponse({ status: 200, type: Vitals })
  @Patch('/:id')
  update(@Param('id') id: number, @Body() dto: UpdateVitalsDto) {
    return this.vitalsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Get all vitals' })
  @ApiResponse({ status: 200, type: [Vitals] })
  @Get()
  getAll() {
    return this.vitalsService.getAll();
  }

  @ApiOperation({ summary: 'Get vitals by patient ID' })
  @ApiResponse({ status: 200, type: [Vitals] })
  @Get('/patient/:patientId')
  getByPatient(@Param('patientId') patientId: number) {
    return this.vitalsService.getAllVitalsByPatientId(patientId);
  }

  @ApiOperation({ summary: 'Get vital record by ID' })
  @ApiResponse({ status: 200, type: Vitals })
  @Get('/:id')
  getById(@Param('id') id: number) {
    return this.vitalsService.getById(id);
  }

  @ApiOperation({ summary: 'Delete vital record' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.vitalsService.delete(id);
  }
}
