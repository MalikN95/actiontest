import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { ChatService } from 'modules/chat/chat.service';
import { ChatEvents } from 'modules/chat/chat-events.enum';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Message } from 'modules/chat/entity/message.entity';
import { MessageDto } from 'modules/chat/dto/message.dto';
import { CreateChatDto } from 'modules/chat/dto/create-chat.dto';
import { Chat } from 'modules/chat/entity/chat.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  private logger: Logger = new Logger('AppGateway');

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      await this.chatService.getUserFromSocket(client);

      this.logger.log(`Client connected: ${client.id}`);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(ChatEvents.JOIN_ROOMS_AS_GUEST)
  async getGuestRooms(
    @MessageBody() businessId: number,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const user = await this.chatService.getUserFromSocket(socket);

      const chatRooms = await this.chatService.getGuestChats(
        user.id,
        businessId,
      );

      socket.join(user.email);
      socket.join(chatRooms.map(({ id }) => `${id}`));

      socket.emit(ChatEvents.SEND_ALL_CHATS, chatRooms);
      this.logger.log(socket.rooms);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage(ChatEvents.CREATE_CHAT)
  async createChat(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<Chat> {
    try {
      const user = await this.chatService.getUserFromSocket(socket);

      const chat = await this.chatService.createChat(user, createChatDto);

      socket.join(`${chat.id}`);

      this.server.sockets
        .to(`${chat.id}`)
        .to(`${createChatDto.businessId}`)
        .emit(ChatEvents.RECEIVE_CHAT, chat);

      return chat;
    } catch (err) {
      this.logger.error(err);
      throw new WsException(err);
    }
  }

  @SubscribeMessage(ChatEvents.JOIN_ALL_ROOMS)
  async getRooms(
    @ConnectedSocket() socket: Socket,
    @MessageBody() businessId: number,
  ): Promise<void> {
    try {
      const user = await this.chatService.getUserFromSocket(socket);

      const chatRooms = await this.chatService.getBusinessChats(
        user.id,
        businessId,
      );

      socket.join(`${businessId}`);
      socket.join(chatRooms.map(({ id }) => `${id}`));
      this.logger.log(socket.rooms);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage(ChatEvents.CREATE_BUSINESS_CHAT)
  async createBusinessChat(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<Chat> {
    try {
      await this.chatService.getUserFromSocket(socket);

      const chat = await this.chatService.createBusinessChat(createChatDto);

      socket.join(`${chat.id}`);

      this.server.sockets
        .to(`${chat.id}`)
        .to(createChatDto.email)
        .emit(ChatEvents.RECEIVE_CHAT, chat);

      return chat;
    } catch (err) {
      this.logger.error(err);
      throw new WsException(err);
    }
  }

  @SubscribeMessage(ChatEvents.SEND_MESSAGE)
  async listenForMessages(
    @MessageBody() messageDto: MessageDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<Message> {
    try {
      const { chatId, content } = messageDto;

      const user = await this.chatService.getUserFromSocket(socket);
      const message = await this.chatService.saveMessage(user, {
        chatId,
        content,
      });

      this.server.sockets
        .to(`${chatId}`)
        .emit(ChatEvents.RECEIVE_MESSAGE, message);

      return message;
    } catch (err) {
      this.logger.error(err);
      throw new WsException(err);
    }
  }
}
