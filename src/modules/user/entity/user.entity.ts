import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from 'modules/bookings/entity/booking.entity';
import { Chat } from 'modules/chat/entity/chat.entity';
import { Message } from 'modules/chat/entity/message.entity';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { RoleEnum } from 'modules/user/enums/role.enum';
import { MessageView } from 'modules/chat/entity/message-view.entity';
import { BusinessViewHistory } from 'modules/business/entity/business-view.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Index()
  @Column('varchar', { length: 320, unique: true })
  email: string;

  @Column('varchar', { length: 175, nullable: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserBusiness, (userBusiness) => userBusiness.user, {
    onDelete: 'CASCADE',
  })
  userBusiness: UserBusiness[];

  @Column({
    type: 'enum',
    enum: [RoleEnum.APP_OPERATOR, RoleEnum.SUPER_ADMIN],
    default: null,
    nullable: true,
  })
  adminRole: RoleEnum;

  @Column('varchar', { length: 175, nullable: true, default: null })
  @Exclude()
  passwordResetToken: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chat: Chat[];

  @OneToMany(() => Message, (message) => message.user)
  message: Message[];

  @OneToMany(() => MessageView, (messageView) => messageView.user, {
    onDelete: 'CASCADE',
  })
  messageView: MessageView[];

  @OneToMany(
    () => BusinessViewHistory,
    (businessViewHistory) => businessViewHistory.user,
  )
  businessViewHistory: BusinessViewHistory[];
}
