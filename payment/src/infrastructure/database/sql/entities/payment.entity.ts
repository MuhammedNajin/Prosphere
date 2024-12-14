import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Subscription } from './subscription.entity';
import { PaymentStatus } from '@/shared/types/enums';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subscription)
  subscription: Subscription;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column('varchar')
  paymentMethod: string;

  @Column('varchar', { nullable: true })
  transactionId: string;

  @Column('simple-json', { nullable: true })
  metadata: {
    provider: string;
    cardLast4?: string;
    receiptUrl?: string;
  };

  @CreateDateColumn()
  createdAt: Date;
}