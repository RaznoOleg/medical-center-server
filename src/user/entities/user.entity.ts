import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import Appointment from 'src/appointment/entities/appointment.entity';
import Availability from 'src/availability/entities/availability.entity';
import Note from 'src/note/entities/note.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne
} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John' })
  @Column({
    unique: false,
    default: null
  })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column({
    unique: false,
    default: null
  })
  lastName: string;

  @Column({
    nullable: true,
    default: null
  })
  gender: string;

  @ApiProperty({ example: 'Local' })
  @Column({
    default: null,
    nullable: true
  })
  role: string;

  @ApiProperty({ example: ' 1' })
  @Column({
    nullable: true,
    default: null
  })
  specialization: number;

  @ApiProperty({ example: '+390992598283' })
  @Column({
    unique: true,
    default: null,
    nullable: true
  })
  phoneNumber: string;

  @ApiProperty({ example: 'john_doe@gmail.com' })
  @Column({
    unique: true,
    default: null
  })
  email: string;

  @Exclude()
  @ApiProperty({ example: '11qqqqqqqqqQ!' })
  @Column({
    select: false,
    nullable: true
  })
  password: string;

  @ApiProperty({ example: '20-01-2000' })
  @Column({
    nullable: true,
    default: null
  })
  birthDate: string;

  @ApiProperty({ example: ' DE' })
  @Column({
    nullable: true,
    default: null
  })
  country: string;

  @ApiProperty({ example: 'Kiev' })
  @Column({
    nullable: true,
    default: null
  })
  city: string;

  @ApiProperty({ example: 'some adress' })
  @Column({ default: null, nullable: true })
  address: string;

  @ApiProperty({ example: ' ????' })
  @Column({
    nullable: true,
    default: null
  })
  photoUrl: string;

  @ApiProperty({ example: '????' })
  @Column({
    select: false,
    default: null,
    nullable: true
  })
  activationLink: string;

  @ApiProperty({ example: false })
  @Column({
    default: false,
    nullable: true
  })
  isVerified: boolean;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => Availability, (availability) => availability.user)
  availabilities: Availability[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
