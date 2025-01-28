import { ApiProperty } from '@nestjs/swagger';
import Patient from 'src/patient/entities/patient.entity';
import User from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export default class Appointment {
  @ApiProperty({ example: '1' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2024-03-25T09:00:00' })
  @Column({ nullable: false })
  startTime: Date;

  @ApiProperty({ example: '2024-03-25T10:00:00' })
  @Column({ nullable: false })
  endTime: Date;

  @ApiProperty({ example: '1' })
  @ManyToOne(() => User, (user) => user.appointments, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: number;

  @ApiProperty({ example: '1' })
  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    nullable: false
  })
  @JoinColumn({ name: 'patientId' })
  patient: number;
}
