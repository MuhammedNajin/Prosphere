import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Plan } from './plan.entity';
import { User } from './user.entity';
import { Payment } from './payment.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

@Entity('subscriptions')
export class Subscription {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.subscriptions)
  user: User;

  @Column('varchar')
  userId: string;

  @ManyToOne(() => Plan, plan => plan.subscriptions)
  plan: Plan;

  @Column('int')
  planId: number;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE
  })
  status: SubscriptionStatus;

  @Column({ 
    type: 'int',
    default: 0 
  })
  jobPostsUsed: number;

  @Column({ 
    type: 'int',
    default: 0 
  })
  resumeAccess: number;


  @Column({ 
    type: 'int',
    default: 0 
  })
  vedioCallUsed: number;


  @OneToMany(() => Payment, payment => payment.subscription)
  payments: Payment[];
}