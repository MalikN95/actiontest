import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'modules/auth/auth.service';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { Business } from 'modules/business/entity/business.entity';
import { CreateChatDto } from 'modules/chat/dto/create-chat.dto';
import { MessageDto } from 'modules/chat/dto/message.dto';
import { Chat } from 'modules/chat/entity/chat.entity';
import { Message } from 'modules/chat/entity/message.entity';
import { User } from 'modules/user/entity/user.entity';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { MessageViewDto } from './dto/message-view.dto';
import { MessageView } from './entity/message-view.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(BusinessObject)
    private readonly objectRepository: Repository<BusinessObject>,
    @InjectRepository(MessageView)
    private readonly messageViewRepository: Repository<MessageView>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserFromSocket(client: Socket): Promise<User> {
    try {
      const { authorization } = client.handshake.headers;
      const user = await this.authService.getUserFromAuthToken(authorization);

      return user;
    } catch (err) {
      throw new WsException(err);
    }
  }

  async findGeneralChat(userId: number, businessId: number): Promise<Chat> {
    try {
      const chat = this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.businessObject', 'businessObject')
        .leftJoinAndSelect('chat.user', 'user')
        .leftJoinAndSelect('chat.business', 'business')
        .where('user.id =  :userId', { userId })
        .andWhere('business.id = :businessId', { businessId })
        .andWhere('businessObject.id is null')
        .getOne();

      return chat;
    } catch (err) {
      throw new WsException(err);
    }
  }

  async createChat(user: User, createChatDto: CreateChatDto): Promise<Chat> {
    try {
      const { businessId } = createChatDto;

      const existingChat = await this.findGeneralChat(user.id, businessId);

      if (existingChat) return existingChat;

      const business = await this.businessRepository.findOneBy({
        id: businessId,
      });

      const guest = await this.userRepository.findOneBy({ id: user.id });

      const chat = this.chatRepository.save({
        business,
        user: guest,
      });

      return chat;
    } catch (err) {
      throw new WsException(err);
    }
  }

  async createBusinessChat(createChatDto: CreateChatDto): Promise<Chat> {
    try {
      const { businessId, businessObjectId, email } = createChatDto;

      const business = await this.businessRepository.findOneBy({
        id: businessId,
      });

      const user = await this.userRepository.findOneBy({ email });

      const businessObject = await this.objectRepository.findOneBy({
        id: businessObjectId,
      });

      const existingChat = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.businessObject', 'businessObject')
        .leftJoinAndSelect('chat.business', 'business')
        .leftJoinAndSelect('chat.user', 'user')
        .where('business.id = :businessId', { businessId })
        .andWhere('user.email = :email', { email })
        .andWhere('businessObject.id =:businessObjectId', { businessObjectId })
        .getOne();

      if (existingChat) throw new WsException('Already exists');

      const chat = this.chatRepository.save({
        user,
        business,
        businessObject,
      });

      return chat;
    } catch (err) {
      throw new WsException(err);
    }
  }

  async getAllChatMessages(chatId: number): Promise<Message[]> {
    try {
      const messages = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoin('message.user', 'user')
        .leftJoinAndSelect('message.chat', 'chat')
        .addSelect([
          'user.id',
          'user.name',
          'user.email',
          'user.createdAt',
          'user.updatedAt',
          'user.adminRole',
        ])
        .where('chat.id = :chatId', { chatId })
        .orderBy('message.id', 'ASC')
        .getMany();

      return messages;
    } catch (err) {
      throw new WsException(err);
    }
  }

  async saveMessage(user: User, messageDto: MessageDto): Promise<Message> {
    const { chatId } = messageDto;
    try {
      const addedMessage = await this.messageRepository.save({
        ...messageDto,
        user,
        chat: { id: chatId },
      });

      return addedMessage;
    } catch (err) {
      throw new WsException(err);
    }
  }

  async getGuestChats(userId: number, businessId?: number): Promise<Chat[]> {
    try {
      if (businessId) {
        const chats = await this.chatRepository
          .createQueryBuilder('chat')
          .leftJoinAndSelect('chat.user', 'user')
          .leftJoinAndSelect('chat.business', 'business')
          .leftJoinAndSelect('chat.businessObject', 'businessObject')
          .where('user.id = :userId', { userId })
          .andWhere('business.id = :businessId', { businessId })
          .andWhere('businessObject IS NULL')
          .getMany();

        return chats;
      }
      const chats = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.user', 'user')
        .leftJoinAndSelect('chat.business', 'business')
        .leftJoinAndSelect('chat.businessObject', 'businessObject')
        .where('user.id = :userId', { userId })
        .getMany();

      return chats;
    } catch (err) {
      throw new WsException(err);
    }
  }

  async getBusinessChats(userId: number, businessId: number): Promise<Chat[]> {
    try {
      const chats = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.user', 'user')
        .leftJoinAndSelect('chat.business', 'business')
        .leftJoin('business.userBusiness', 'userBusiness')
        .leftJoinAndSelect('userBusiness.user', 'users')
        .leftJoinAndSelect('chat.businessObject', 'businessObject')
        .leftJoinAndMapOne('chat.message', 'chat.message', 'message')
        .where('business.id = :businessId', { businessId })
        .andWhere('users.id = :userId', { userId })
        .orderBy(
          '(CASE WHEN message.createdAt IS NULL THEN chat.createdAt ELSE message.createdAt END)',
          'DESC',
        )
        .getMany();
      return chats;
    } catch (err) {
      throw new WsException(err);
    }
  }

  async findChatFolders(businessId: number): Promise<BusinessObject[]> {
    try {
      const objectList = await this.objectRepository
        .createQueryBuilder('object')
        .leftJoinAndSelect('object.business', 'business')
        .leftJoinAndMapOne('object.chat', 'object.chat', 'chat')
        .leftJoinAndMapOne('chat.message', 'chat.message', 'message')
        .where('business.id = :businessId', { businessId })
        .orderBy(
          '(CASE WHEN message.createdAt IS NULL THEN chat.createdAt ELSE message.createdAt END)',
          'DESC',
        )
        .getMany();

      return objectList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneChat(
    businessId: number,
    businessObjectId?: number,
  ): Promise<Chat> {
    try {
      const chat = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.user', 'user')
        .leftJoinAndSelect('chat.business', 'business')
        .leftJoinAndSelect('chat.businessObject', 'businessObject')
        .where('business.id = :businessId', { businessId })
        .andWhere('businessObject.id = :businessObjectId', { businessObjectId })
        .getOne();

      return chat;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChatMessages(
    id: number,
    pageSize: number,
    skipPages: number,
  ): Promise<Message[]> {
    try {
      const messages = await this.messageRepository
        .createQueryBuilder('message')
        .orderBy('message.createdAt', 'DESC')
        .where('message.chat.id = :id', { id })
        .leftJoin('message.user', 'user')
        .addSelect('user.name')
        .skip(pageSize * skipPages)
        .take(pageSize)
        .getMany();

      return messages;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateLastMessageView(
    messageViewDto: MessageViewDto,
  ): Promise<{ message: string }> {
    try {
      const { userId, chatId, messageId } = messageViewDto;
      const checkView = await this.messageViewRepository
        .createQueryBuilder('message-view')
        .where(
          'message-view.user.id = :userId and message-view.chat.id = :chatId',
          { userId, chatId },
        )
        .getOne();

      if (checkView) {
        const { id } = checkView;

        await this.messageViewRepository
          .createQueryBuilder()
          .update(MessageView)
          .set({
            user: { id: userId },
            chat: { id: chatId },
            message: { id: messageId },
          })
          .where('id = :id', { id })
          .execute();

        return {
          message: 'Record updated',
        };
      }
      await this.messageViewRepository.save({
        user: { id: userId },
        chat: { id: chatId },
        message: { id: messageId },
      });

      return {
        message: 'Record saved',
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
