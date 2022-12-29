import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { ChatService } from 'modules/chat/chat.service';
import { Chat } from 'modules/chat/entity/chat.entity';
import { Message } from 'modules/chat/entity/message.entity';
import { MessageViewDto } from './dto/message-view.dto';

@ApiTags('chat-messages')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('guest-chats')
  getGuestChats(@Req() req: AuthRequest): Promise<Chat[]> {
    return this.chatService.getGuestChats(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('messages')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Chat id',
  })
  getChatMessages(@Query('id') id: number): Promise<Message[]> {
    return this.chatService.getAllChatMessages(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('last-view')
  updateLastMessageView(
    @Body() messageViewDto: MessageViewDto,
  ): Promise<{ message: string }> {
    return this.chatService.updateLastMessageView(messageViewDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('business-folders/:businessId')
  findBusinessFolders(
    @Param('businessId') businessId: number,
  ): Promise<BusinessObject[]> {
    return this.chatService.findChatFolders(businessId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('find-one/:businessId/:businessObjectId')
  findOneChat(
    @Param('businessId') businessId: number,
    @Param('businessObjectId') businessObjectId: number,
  ): Promise<Chat> {
    return this.chatService.findOneChat(businessId, businessObjectId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':businessId')
  getBusinessChats(
    @Param('businessId') businessId: number,
    @Req() req: AuthRequest,
  ): Promise<Chat[]> {
    return this.chatService.getBusinessChats(req.user.id, businessId);
  }
}
