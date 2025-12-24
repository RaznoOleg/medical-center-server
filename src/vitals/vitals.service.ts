import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vitals } from './entities/vitals.entity';
import { CreateVitalsDto } from './dto/create-vitals.dto';
import { UpdateVitalsDto } from './dto/update-vitals.dto';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class VitalsService {
  constructor(
    @InjectRepository(Vitals)
    private readonly vitalsRepository: Repository<Vitals>,
    private readonly patientService: PatientService
  ) {}

  async create(createDto: CreateVitalsDto): Promise<Vitals> {
    try {
      await this.patientService.getPatientById(createDto.patientId);

      const newVitals = await this.vitalsRepository
        .createQueryBuilder()
        .insert()
        .into(Vitals)
        .values({ ...createDto, patient: createDto.patientId })
        .execute();

      return newVitals.generatedMaps[0] as Vitals;
    } catch (error) {
      throw new HttpException(
        `Failed to create vital record: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: number, updateDto: UpdateVitalsDto): Promise<Vitals> {
    try {
      await this.vitalsRepository.update(id, updateDto);
      return this.vitalsRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new HttpException('Vital record not found', HttpStatus.NOT_FOUND);
    }
  }

  async getAll(): Promise<Vitals[]> {
    return this.vitalsRepository.find({ relations: ['patient'] });
  }

  async getAllVitalsByPatientId(patientId: number): Promise<Vitals[]> {
    try {
      await this.patientService.getPatientById(patientId);

      return await this.vitalsRepository
        .createQueryBuilder('vitals')
        .leftJoinAndSelect('vitals.patient', 'patient')
        .where('patient.id = :patientId', { patientId })
        .orderBy('vitals.measurementTime', 'DESC')
        .getMany();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getLastVitalsByPatientId(
    patientId: number,
    count: number
  ): Promise<Vitals[]> {
    try {
      await this.patientService.getPatientById(patientId);

      return await this.vitalsRepository
        .createQueryBuilder('vitals')
        .leftJoinAndSelect('vitals.patient', 'patient')
        .where('patient.id = :patientId', { patientId })
        .orderBy('vitals.measurementTime', 'DESC')
        .limit(count)
        .getMany();
    } catch (err) {
      throw new HttpException(
        `Failed to get last ${count} vitals: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getById(id: number): Promise<Vitals> {
    try {
      return await this.vitalsRepository.findOneOrFail({
        where: { id },
        relations: ['patient']
      });
    } catch (error) {
      throw new HttpException('Vital record not found', HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.getById(id);

      await this.vitalsRepository
        .createQueryBuilder()
        .delete()
        .from(Vitals)
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
