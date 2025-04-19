import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from './company.entitiy';
import { PlanType, SubscriptionStatus } from '@/shared/types/enums';

interface PlanSnapshot {
  id: number
  name: string;
  price: number;
  durationInDays: number;
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

  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number;

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
}