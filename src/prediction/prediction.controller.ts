import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param
} from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionDto } from './dto/prediction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Prediction')
@ApiBearerAuth('access-token')
@Controller('predictions')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @ApiOperation({ summary: 'Make a medical complication prediction' })
  @ApiResponse({ status: 201, description: 'Prediction result' })
  @Post('/predict')
  async predict(@Body(new ValidationPipe()) predictionDto: PredictionDto) {
    return this.predictionService.predict(predictionDto);
  }

  @ApiOperation({ summary: 'Get prediction history for a patient' })
  @ApiResponse({ status: 200, description: 'List of past predictions' })
  @Get('/patient/:id')
  async getPredictions(@Param('id') id: number) {
    return this.predictionService.getPredictions(id);
  }
}
