import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
import { PlanType } from '@/shared/types/plan.interface';

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

  @Column('int', { default: 0 })
  jobPostLimit: number;

  @Column('simple-json')
  featuresLimit: {
    JobPostLimit: number;
    resumeAccess: number;
    videoCallLimit: number; 
  };

  @Column('varchar', { array: true })
  features: string[]

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
