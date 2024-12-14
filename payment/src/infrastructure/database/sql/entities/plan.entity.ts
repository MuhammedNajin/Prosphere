import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
import { PlanType } from '@/shared/types/enums';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.BASIC,
  })
  type: PlanType;

  @Column('int')
  durationInDays: number;

  @Column('simple-json')
  featuresLimit: {
    jobPostLimit: number;
    resumeAccess: number;
    videoCallLimit: number;
    candidateNotes: boolean;
  };

  @Column('varchar', { array: true })
  features: string[];

  @Column('boolean', { default: true })
  isActive: boolean;
}