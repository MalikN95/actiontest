import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { ChatSettingsController } from 'modules/chat-settings/chat-settings.controller';
import { ChatSettingsService } from 'modules/chat-settings/chat-settings.service';
import { ChatAnswer } from 'modules/chat-settings/entity/chat-answer.entity';
import { ChatQuestion } from 'modules/chat-settings/entity/chat-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, ChatQuestion, ChatAnswer])],
  controllers: [ChatSettingsController],
  providers: [ChatSettingsService],
})
export class ChatSettingsModule {}
