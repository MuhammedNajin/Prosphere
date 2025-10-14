import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { SubscriptionStatus } from '@/shared/types/enums';

interface PlanSnapshot {
  id: number;
  name: string;
  price: number;
  durationInDays: number; // can be 0 for usage-based trials
  features: string[];
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  // Copy of plan details at the time of subscription (immutable snapshot)
  @Column('simple-json')
  planSnapshot: PlanSnapshot;

  @Column('varchar', { nullable: true })
  companyId: string;

  @Column('timestamp', { nullable: true })
  startDate: Date;

  @Column('timestamp', { nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  // For both paid and trial subscriptions
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  // Usage tracking (jobs)
  @Column('int', { default: 0 })
  jobsAllowed: number;

  @Column('int', { default: 0 })
  jobsUsed: number;

  // Trial specific
  @Column('boolean', { default: false })
  isTrial: boolean;

  @Column('timestamp', { nullable: true })
  trialEndsAt: Date; // useful if trial is time-based too

  // Cancellations
  @Column('timestamp', { nullable: true })
  cancelledAt: Date;

  @Column('varchar', { nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
