import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChatSettingsService } from 'modules/chat-settings/chat-settings.service';
import { BusinessChatAnswerDto } from 'modules/chat-settings/dto/chat-answer.dto';
import { BusinessChatColorDto } from 'modules/chat-settings/dto/chat-color.dto';
import { BusinessChatQuestionDto } from 'modules/chat-settings/dto/chat-question.dto';
import { ChatAnswer } from 'modules/chat-settings/entity/chat-answer.entity';
import { ChatQuestion } from 'modules/chat-settings/entity/chat-question.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiTags('chat-settings')
@Controller('chat')
export class ChatSettingsController {
  constructor(private readonly chatService: ChatSettingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-chat-color')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  updateBusinessChatColor(
    @Query('id') id: number,
    @Body() chatColorDto: BusinessChatColorDto,
  ): Promise<UpdateResult> {
    return this.chatService.updateBusinessChatColor(id, chatColorDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-chat-question')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  addChatQuestion(
    @Query('id') businessId: number,
    @Body() businessChatQuestionDto: BusinessChatQuestionDto,
  ): Promise<ChatQuestion> {
    return this.chatService.addChatQuestion(
      businessId,
      businessChatQuestionDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-chat-question')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  getChatQuestion(@Query('id') id: number): Promise<ChatQuestion[]> {
    return this.chatService.getChatQuestion(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-chat-answer')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  addChatAnswer(
    @Query('id') businessId: number,
    @Body() businessChatAnswerDto: BusinessChatAnswerDto,
  ): Promise<ChatAnswer> {
    return this.chatService.addChatAnswer(businessId, businessChatAnswerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-chat-answer')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  getChatAnswer(@Query('id') id: number): Promise<ChatAnswer[]> {
    return this.chatService.getChatAnswer(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete-chat-question')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Question id',
  })
  deleteChatQuestion(@Query('id') id: number): Promise<DeleteResult> {
    return this.chatService.deleteChatQuestion(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete-chat-answer')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Answer id',
  })
  deleteChatAnswer(@Query('id') id: number): Promise<DeleteResult> {
    return this.chatService.deleteChatAnswer(id);
  }
}
