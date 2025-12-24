import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('prediction')
export class Prediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: number;

  @Column('float')
  riskProbability: number;

  @Column()
  riskLevel: string;

  @Column('float')
  estimatedDaysUntilComplication: number;

  @Column('json', { nullable: true })
  summary: string[];

  @CreateDateColumn()
  createdAt: Date;
}
