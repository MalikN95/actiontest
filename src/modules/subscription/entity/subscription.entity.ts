import { Business } from 'modules/business/entity/business.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subscription')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false, nullable: false })
  active: boolean;

  @Column({ nullable: true })
  subscriptionDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: true })
  adminHasNotSeen: boolean;

  @OneToOne(() => Business, (business) => business.subscription, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  business: Business;
}
