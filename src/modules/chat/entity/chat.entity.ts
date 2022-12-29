import { Business } from 'modules/business/entity/business.entity';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { Message } from 'modules/chat/entity/message.entity';
import { User } from 'modules/user/entity/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageView } from './message-view.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.chat, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @OneToMany(() => Message, (message) => message.chat)
  message: Message[];

  @ManyToOne(() => User, (user) => user.chat, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => BusinessObject, (businessObject) => businessObject.chat, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  businessObject: BusinessObject;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => MessageView, (messageView) => messageView.chat, {
    onDelete: 'CASCADE',
  })
  messageView: MessageView[];
}
