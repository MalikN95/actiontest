import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/auth.module';
import { Business } from 'modules/business/entity/business.entity';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { ChatController } from 'modules/chat/chat.controller';
import { ChatGateway } from 'modules/chat/chat.gateway';
import { ChatService } from 'modules/chat/chat.service';
import { Chat } from 'modules/chat/entity/chat.entity';
import { Message } from 'modules/chat/entity/message.entity';
import { User } from 'modules/user/entity/user.entity';
import { MessageView } from './entity/message-view.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Business,
      Chat,
      Message,
      User,
      BusinessObject,
      User,
      MessageView,
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
