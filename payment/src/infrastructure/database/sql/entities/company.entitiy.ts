import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Subscription } from "./subscription.entity";

@Entity("companies")
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true })
  companyId: string;

  @Column("varchar")
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("varchar", { nullable: true })
  logo: string;

  @ManyToOne(() => User, (user) => user.userId)
  owner: User;

  @OneToOne(() => Subscription, (subscription) => subscription.company)
  subscription: Subscription;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
