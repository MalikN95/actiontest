import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { User } from 'modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  checkIn: Date;

  @Column({ nullable: false })
  checkOut: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.booking, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => BusinessObject, (businessObject) => businessObject.booking, {
    onDelete: 'CASCADE',
  })
  businessObject: BusinessObject;

  isBooking: boolean;
}
