import { Booking } from 'modules/bookings/entity/booking.entity';
import { Chat } from 'modules/chat/entity/chat.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from './business.entity';

@Entity('businessObject')
export class BusinessObject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  objectName: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  wifiName: string;

  @Column({ nullable: true })
  wifiPassword: string;

  @ManyToOne(() => Business, (business) => business.businessObject, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @OneToMany(() => Booking, (booking) => booking.businessObject, {
    nullable: false,
  })
  booking: Booking;

  @OneToMany(() => Chat, (chat) => chat.businessObject)
  chat: Chat;
}
