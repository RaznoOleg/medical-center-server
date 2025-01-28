import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Patient from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreatePatientDto from './dto/create-patient.dto';
import UpdatePatientDto from './dto/update-patient.dto';
import CheckPatientEmailDto from './dto/check-patient-email.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>
  ) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const newPatient = await this.patientRepository
        .createQueryBuilder()
        .insert()
        .into(Patient)
        .values({ ...createPatientDto })
        .execute();

      return newPatient.generatedMaps[0] as Patient;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePatient(
    patientId: number,
    patientDto: UpdatePatientDto
  ): Promise<Patient> {
    try {
      const patient = await this.getPatientById(patientId);

      Object.assign(patient, patientDto);
      return await this.patientRepository.save(patient);
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllPatients(): Promise<Patient[]> {
    try {
      const patients = await this.patientRepository
        .createQueryBuilder('patient')
        .orderBy('patient.id', 'DESC')
        .getMany();
      return patients;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPatientById(patientId: number): Promise<Patient> {
    try {
      const patient = await this.patientRepository.findOneOrFail({
        where: { id: patientId }
      });

      return patient;
    } catch (error) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }
  }

  async getPatientByEmail(email: string): Promise<Patient> {
    try {
      const patient = await this.patientRepository
        .createQueryBuilder('patient')
        .where('patient.email = :email', { email })
        .getOne();

      if (!patient) return null;
      return patient;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkEmail(patientDto: CheckPatientEmailDto): Promise<void> {
    const patient = await this.getPatientByEmail(patientDto.email);
    if (patient) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT
      );
    }
  }
}
