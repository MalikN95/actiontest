import { ChatAnswer } from 'modules/chat-settings/entity/chat-answer.entity';
import { ChatQuestion } from 'modules/chat-settings/entity/chat-question.entity';
import { Chat } from 'modules/chat/entity/chat.entity';
import { Explore } from 'modules/explore/entity/explore.entity';
import { Services } from 'modules/services/entity/services.entity';
import { Subscription } from 'modules/subscription/entity/subscription.entity';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BusinessChatColorEnum } from '../enums/business-chat-color.enum';
import { BusinessTypesEnum } from '../enums/business.enum';
import { BusinessObject } from './business-object.entity';
import { BusinessViewHistory } from './business-view.entity';
import { Gallery } from './gallery.entity';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  businessName: string;

  @Column({ nullable: false })
  address: string;

  @Column({ type: 'enum', enum: BusinessTypesEnum, nullable: false })
  businessType: BusinessTypesEnum;

  @Column({ nullable: true, default: 'default-logo.jpg' })
  logotypeUrl: string;

  @Column({ nullable: true, default: 'default-background.jpg' })
  backgroundUrl: string;

  @Column({ default: false })
  galleryActive: boolean;

  @Column({ default: false })
  aboutActive: boolean;

  @Column({ nullable: true })
  aboutTitle: string;

  @Column({ nullable: true })
  aboutDescription: string;

  @Column({ nullable: true })
  aboutImgUrl: string;

  @Column({ default: false })
  wifiActive: boolean;

  @Column({ nullable: true })
  wifiName: string;

  @Column({ nullable: true })
  wifiPassword: string;

  @Column({ default: false })
  amenitiesActive: boolean;

  @Column({ nullable: true })
  amenitiesTitle: string;

  @Column({ nullable: true })
  amenitiesDescription: string;

  @Column({
    type: 'enum',
    enum: BusinessChatColorEnum,
    default: BusinessChatColorEnum.CREEN,
  })
  chatColor: BusinessChatColorEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserBusiness, (userBusiness) => userBusiness.business, {
    onDelete: 'CASCADE',
  })
  userBusiness: UserBusiness[];

  @OneToOne(() => Subscription, (subscription) => subscription.business, {
    onDelete: 'CASCADE',
  })
  subscription: Subscription;

  @OneToMany(() => BusinessObject, (businessObject) => businessObject.business)
  businessObject: BusinessObject[];

  @OneToMany(() => Services, (services) => services.business)
  services: Services[];

  @OneToMany(() => Explore, (explore) => explore.business)
  explore: Explore[];

  @OneToMany(() => Gallery, (gallery) => gallery.business)
  gallery: Gallery[];

  @OneToMany(() => ChatAnswer, (chatAnswer) => chatAnswer.business)
  chatAnswer: ChatAnswer[];

  @OneToMany(() => ChatQuestion, (chatQuestion) => chatQuestion.business)
  chatQuestion: ChatQuestion[];

  @OneToMany(() => Chat, (chat) => chat.business)
  chat: Chat[];

  @OneToMany(
    () => BusinessViewHistory,
    (businessViewHistory) => businessViewHistory.business,
  )
  businessViewHistory: BusinessViewHistory[];
}
