import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Availability from './entities/availability.entity';
import { Between, Repository } from 'typeorm';
import CreateAvailabilityDto from './dto/create-availability.dto';
import { UserService } from 'src/user/user.service';
import { NO_ROWS_AFFECTED } from 'src/common/consts';
import { endOfDay, startOfDay } from 'date-fns';
import { AppointmentService } from 'src/appointment/appointment.service';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
    private readonly userService: UserService,
    private readonly appointmentService: AppointmentService
  ) {}

  async createAvailability(
    userId: number,
    createAvailabilityDto: CreateAvailabilityDto
  ): Promise<Availability> {
    try {
      const { startTime, endTime } = createAvailabilityDto;

      await this.userService.getUserById(userId);

      await this.validateTimePeriod(startTime, endTime);

      const existAvailability = await this.checkIfExistAvailability(
        userId,
        createAvailabilityDto
      );

      if (existAvailability) {
        throw new HttpException(
          'User already has availability during this time',
          HttpStatus.BAD_REQUEST
        );
      }

      const newAvailability = await this.availabilityRepository
        .createQueryBuilder()
        .insert()
        .into(Availability)
        .values({ startTime, endTime, user: userId })
        .execute();

      return newAvailability.generatedMaps[0] as Availability;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateTimePeriod(startTime: Date, endTime: Date): Promise<void> {
    if (startTime >= endTime) {
      throw new HttpException(
        'Start time must be before end time',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async checkIfExistAvailability(
    userId: number,
    availabilityDto: CreateAvailabilityDto
  ): Promise<Availability> {
    try {
      const { startTime, endTime } = availabilityDto;

      const startTimeWithoutMilliseconds = new Date(startTime);
      const endTimeWithoutMilliseconds = new Date(endTime);
      startTimeWithoutMilliseconds.setMilliseconds(0);
      endTimeWithoutMilliseconds.setMilliseconds(0);

      return await this.availabilityRepository
        .createQueryBuilder('availability')
        .where('availability.userId = :userId', { userId })
        .andWhere(
          '(availability.startTime < :endTime AND availability.endTime > :startTime)',
          {
            startTime: startTimeWithoutMilliseconds,
            endTime: endTimeWithoutMilliseconds
          }
        )
        .getOne();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAvailability(
    userId: number,
    availabilityId: string
  ): Promise<void> {
    try {
      await this.userService.getUserById(userId);

      const availability = await this.getAvailabilityById(availabilityId);

      if (!availability) {
        throw new HttpException('Availability not found', HttpStatus.NOT_FOUND);
      }

      const overlappingAppointments =
        await this.appointmentService.checkOverlappingAppointments(
          userId,
          availability.startTime,
          availability.endTime
        );

      if (overlappingAppointments > 0) {
        throw new HttpException(
          'Cannot delete availability with existing appointments',
          HttpStatus.CONFLICT
        );
      }

      const result = await this.availabilityRepository
        .createQueryBuilder()
        .delete()
        .from(Availability)
        .where('uuid = :uuid', { uuid: availabilityId })
        .andWhere('user.id = :userId', { userId })
        .execute();

      if (result.affected === NO_ROWS_AFFECTED) {
        throw new HttpException(
          'Availability does not belong to the user',
          HttpStatus.NOT_FOUND
        );
      }
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAvailabilityById(availabilityId: string): Promise<Availability> {
    try {
      const availability = await this.availabilityRepository.findOneOrFail({
        where: { uuid: availabilityId },
        relations: ['user']
      });

      return availability;
    } catch (error) {
      throw new HttpException('Availability not found', HttpStatus.NOT_FOUND);
    }
  }

  async getAllAvailabilitiesByUserId(userId: number): Promise<Availability[]> {
    try {
      await this.userService.getUserById(userId);

      const availabilities = await this.availabilityRepository
        .createQueryBuilder('availability')
        .select([
          'availability.uuid',
          'availability.startTime',
          'availability.endTime'
        ])
        .leftJoin('availability.user', 'user')
        .where('availability.userId = :userId', { userId })
        .getMany();

      return availabilities;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAvailabilitiesByUserIdAndDay(
    userId: number,
    selectedDay: string
  ): Promise<Availability[]> {
    try {
      await this.userService.getUserById(userId);

      const startOfSelectedDay = startOfDay(selectedDay);
      const endOfSelectedDay = endOfDay(selectedDay);

      const availabilities = await this.availabilityRepository
        .createQueryBuilder('availability')
        .where('availability.userId = :userId', { userId })
        .andWhere('availability.startTime >= :startOfDay', {
          startOfDay: startOfSelectedDay
        })
        .andWhere('availability.endTime <= :endOfDay', {
          endOfDay: endOfSelectedDay
        })
        .getMany();

      return availabilities;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
