import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

@Entity('payments')
export class Payment {

  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => User, user => user.payments)
  user: User;


  @Column('int')
  userId: number;


  @ManyToOne(() => Subscription, subscription => subscription.payments)
  subscription: Subscription;


  @Column('int')
  subscriptionId: number;

 
  @Column('decimal', { 
    precision: 10, 
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  amount: number;


  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  
  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: true 
  })
  transactionId: string;


  @Column({ 
    type: 'varchar', 
    length: 100, 
    default: 'online'
  })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;
}