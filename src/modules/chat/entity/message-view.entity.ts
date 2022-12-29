import { User } from 'modules/user/entity/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { Message } from './message.entity';

@Entity('message-view')
export class MessageView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Message, (message) => message.messageView)
  @JoinColumn({ name: 'lastMessageId' })
  message: Message;

  @ManyToOne(() => User, (user) => user.messageView, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messageView)
  chat: Chat;
}
