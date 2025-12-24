import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Patient from 'src/patient/entities/patient.entity';

@Entity('vitals')
export class Vitals {
  @ApiProperty({ example: 1, description: 'Unique ID of the record' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 120, description: 'Systolic blood pressure (mmHg)' })
  @Column({ type: 'float' })
  systolic: number;

  @ApiProperty({ example: 80, description: 'Diastolic blood pressure (mmHg)' })
  @Column({ type: 'float' })
  diastolic: number;

  @ApiProperty({ example: 5.6, description: 'Glucose level (mmol/L)' })
  @Column({ type: 'float' })
  glucose: number;

  @ApiProperty({ example: 72, description: 'Heart rate (bpm)' })
  @Column({ type: 'float' })
  pulse: number;

  @ApiProperty({
    example: '2025-10-26T12:00:00Z',
    description: 'Date and time of measurement'
  })
  @CreateDateColumn({ name: 'measurement_time' })
  measurementTime: Date;

  @ApiProperty({ example: '1' })
  @ManyToOne(() => Patient, (patient) => patient.vitals, {
    nullable: false
  })
  @JoinColumn({ name: 'patientId' })
  patient: number;
}
