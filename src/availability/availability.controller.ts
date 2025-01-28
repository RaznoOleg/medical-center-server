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
import { AvailabilityService } from './availability.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import Availability from './entities/availability.entity';
import CreateAvailabilityDto from './dto/create-availability.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IUserRequest } from 'src/common/types';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @ApiOperation({ summary: 'Create availability' })
  @ApiResponse({ status: 201, type: Availability })
  @Post()
  createAvailability(
    @Req() req: IUserRequest,
    @Body() availabilityDto: CreateAvailabilityDto
  ): Promise<Availability> {
    return this.availabilityService.createAvailability(
      req.user?.id,
      availabilityDto
    );
  }

  @ApiOperation({ summary: 'Getting an availability by UUID' })
  @ApiResponse({ status: 200, type: Availability })
  @Get('/:uuid')
  getAvailabilityById(@Param('uuid') uuid: string): Promise<Availability> {
    return this.availabilityService.getAvailabilityById(uuid);
  }

  @ApiOperation({ summary: 'Delete user availability' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Delete('/:uuid')
  deleteAvailability(
    @Req() req: IUserRequest,
    @Param('uuid') uuid: string
  ): Promise<void> {
    return this.availabilityService.deleteAvailability(req.user?.id, uuid);
  }

  @ApiOperation({ summary: 'Getting all doctor availabilities' })
  @ApiResponse({ status: 200, type: [Availability] })
  @Get('/user/:id/all')
  getAllAvailabilitiesByUserId(
    @Param('id') userId: number
  ): Promise<Availability[]> {
    return this.availabilityService.getAllAvailabilitiesByUserId(userId);
  }

  @ApiOperation({ summary: 'Get availabilities by user ID and day' })
  @ApiResponse({ status: 200, type: [Availability] })
  @Get('/user/:id/day/:selectedDay')
  getAvailabilitiesByUserIdAndDay(
    @Param('id') userId: number,
    @Param('selectedDay') selectedDay: string
  ): Promise<Availability[]> {
    return this.availabilityService.getAllAvailabilitiesByUserIdAndDay(
      userId,
      selectedDay
    );
  }
}
