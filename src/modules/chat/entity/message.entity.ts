import { User } from 'modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { MessageView } from './message-view.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => Chat, (chat) => chat.message, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.message, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => MessageView, (messageView) => messageView.message, {
    onDelete: 'CASCADE',
  })
  messageView: MessageView[];

  unreadMessage: number;

  @CreateDateColumn()
  createdAt: Date;
}
