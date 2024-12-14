import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Plan } from './plan.entity';
import { Company } from './company.entitiy';
import { PlanType, SubscriptionStatus } from '@/shared/types/enums';

interface PlanSnapshot {
  name: string;
  type: PlanType;
  price: number;
  featuresLimit: {
    jobPostLimit: number;
    resumeAccess: number;
    videoCallLimit: number;
    candidateNotes: boolean;
  };
  features: string[];
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;


  @Column('simple-json')
  planSnapshot: PlanSnapshot;


  @ManyToOne(() => Company, (company) => company.id)
  company: Company;


  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;


  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

 
  @Column('simple-json')
  usageStats: {
    jobPostsUsed: number;
    resumeDownloads: number;
    videoCallsUsed: number;
    featuredJobsUsed: number;
    lastResetDate: Date;
  };

  
  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number;

  @Column('boolean', { default: false })
  autoRenew: boolean;


  @Column('boolean', { default: false })
  isTrial: boolean;

  @Column('timestamp', { nullable: true })
  trialEndsAt: Date;

  
  @Column('timestamp', { nullable: true })
  cancelledAt: Date;

  @Column('varchar', { nullable: true })
  cancellationReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isActive(): boolean {
    return (
      this.status === SubscriptionStatus.ACTIVE &&
      new Date() <= this.endDate &&
      (!this.isTrial || new Date() <= this.trialEndsAt)
    );
  }

}