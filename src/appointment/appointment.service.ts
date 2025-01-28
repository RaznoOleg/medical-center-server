import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
  forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Appointment from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PatientService } from 'src/patient/patient.service';
import CreateAppointmentDto from './dto/create-appointment.dto';
import { AvailabilityService } from 'src/availability/availability.service';
import { endOfDay, startOfDay } from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppointmentService implements OnModuleInit {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly userService: UserService,
    private readonly patientService: PatientService,
    @Inject(forwardRef(() => AvailabilityService))
    private readonly availabilityService: AvailabilityService
  ) {}

  async onModuleInit() {
    await this.deleteAppointments();
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto
  ): Promise<Appointment> {
    try {
      const { startTime, endTime, userId, patientId } = createAppointmentDto;

      await Promise.all([
        this.userService.getUserById(userId),
        this.patientService.getPatientById(patientId),
        this.availabilityService.validateTimePeriod(startTime, endTime)
      ]);

      const existAppointment =
        await this.checkIfExistAppointment(createAppointmentDto);

      if (existAppointment) {
        throw new HttpException(
          'User and/or patient already have a record for this time period',
          HttpStatus.BAD_REQUEST
        );
      }

      const newAppointment = await this.appointmentRepository
        .createQueryBuilder()
        .insert()
        .into(Appointment)
        .values({ startTime, endTime, user: userId, patient: patientId })
        .execute();

      return newAppointment.generatedMaps[0] as Appointment;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async checkIfExistAppointment(
    appointmentDto: CreateAppointmentDto
  ): Promise<Appointment> {
    try {
      const { startTime, endTime, patientId } = appointmentDto;

      const startTimeWithoutMilliseconds = new Date(startTime);
      const endTimeWithoutMilliseconds = new Date(endTime);
      startTimeWithoutMilliseconds.setMilliseconds(0);
      endTimeWithoutMilliseconds.setMilliseconds(0);

      const appointment = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.patientId = :patientId', { patientId })
        .andWhere(
          '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
          {
            startTime: startTimeWithoutMilliseconds,
            endTime: endTimeWithoutMilliseconds
          }
        )
        .getOne();

      return appointment;
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    try {
      await this.userService.getUserById(userId);

      return await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.user', 'user')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .where('user.id = :userId', { userId })
        .orderBy('appointment.startTime', 'ASC')
        .getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAppointmentsByPatientId(
    patientId: number
  ): Promise<Appointment[]> {
    try {
      await this.patientService.getPatientById(patientId);

      return await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.user', 'user')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .where('patient.id = :patientId', { patientId })
        .orderBy('appointment.startTime', 'ASC')
        .getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllTodayAppointmentsByUserId(
    userId: number
  ): Promise<Appointment[]> {
    try {
      await this.userService.getUserById(userId);

      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      return await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.user', 'user')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .where('user.id = :userId', { userId })
        .andWhere('appointment.startTime >= :startOfToday', { startOfToday })
        .andWhere('appointment.endTime <= :endOfToday', { endOfToday })
        .orderBy('appointment.startTime', 'ASC')
        .getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.findOneOrFail({
        where: { id: appointmentId },
        relations: ['user', 'patient']
      });

      return appointment;
    } catch (error) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteAppointmentById(appointmentId: number): Promise<void> {
    try {
      await this.getAppointmentById(appointmentId);

      await this.appointmentRepository
        .createQueryBuilder()
        .delete()
        .from(Appointment)
        .where('id = :id', { id: appointmentId })
        .execute();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteAppointments(): Promise<void> {
    try {
      const today = startOfDay(new Date());
      await this.appointmentRepository
        .createQueryBuilder()
        .delete()
        .from(Appointment)
        .where('endTime < :today', { today })
        .execute();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkOverlappingAppointments(
    userId: number,
    startTime: Date,
    endTime: Date
  ): Promise<number> {
    const count = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.userId = :userId', { userId })
      .andWhere(
        'appointment.startTime < :endTime AND appointment.endTime > :startTime',
        {
          startTime,
          endTime
        }
      )
      .getCount();

    return count;
  }
}
