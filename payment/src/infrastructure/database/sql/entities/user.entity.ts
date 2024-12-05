import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Payment } from './payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar'
  })
  userId: string

  @Column({ 
    type: 'varchar', 
    length: 50, 
    unique: true 
  })
  username: string;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    unique: true 
  })
  email: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    nullable: true 
  })
  phone: string;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: true 
  })
  jobRole: string;

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];
}