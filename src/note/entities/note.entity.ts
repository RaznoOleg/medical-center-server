import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { IsString } from 'class-validator';
import Patient from 'src/patient/entities/patient.entity';
import User from 'src/user/entities/user.entity';
import { File } from './file.entity';

@Entity()
export default class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Note content' })
  @Column()
  @IsString()
  content: string;

  @ApiProperty({ example: '2024-03-09T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2024-03-09T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: '5' })
  @ManyToOne(() => Patient, (patient) => patient.notes, { nullable: false })
  @JoinColumn({ name: 'patientId' })
  patient: number;

  @ApiProperty({ example: '5' })
  @ManyToOne(() => User, (user) => user.notes, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: number;

  @OneToMany(() => File, (file) => file.note)
  files: File[];
}
