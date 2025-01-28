import { ApiProperty } from '@nestjs/swagger';
import User from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export default class Availability {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'c3864420-2d55-4483-b861-4970e3b7ea40' })
  uuid: string;

  @ApiProperty({ example: '2024-03-25T09:00:00' })
  @Column({ nullable: false })
  startTime: Date;

  @ApiProperty({ example: '2024-03-25T10:00:00' })
  @Column({ nullable: false })
  endTime: Date;

  @ApiProperty({ example: '1' })
  @ManyToOne(() => User, (user) => user.availabilities, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: number;
}
