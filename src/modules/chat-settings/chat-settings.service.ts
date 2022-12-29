import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { BusinessChatAnswerDto } from 'modules/chat-settings/dto/chat-answer.dto';
import { BusinessChatColorDto } from 'modules/chat-settings/dto/chat-color.dto';
import { BusinessChatQuestionDto } from 'modules/chat-settings/dto/chat-question.dto';
import { ChatAnswer } from 'modules/chat-settings/entity/chat-answer.entity';
import { ChatQuestion } from 'modules/chat-settings/entity/chat-question.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ChatSettingsService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(ChatQuestion)
    private readonly questionRepository: Repository<ChatQuestion>,
    @InjectRepository(ChatAnswer)
    private readonly answerRepository: Repository<ChatAnswer>,
  ) {}

  async updateBusinessChatColor(
    id: number,
    chatColorDto: BusinessChatColorDto,
  ): Promise<UpdateResult> {
    try {
      const { color } = chatColorDto;
      const business = new Business();
      business.chatColor = color;
      const chatColor = await this.businessRepository.update(id, business);

      return chatColor;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addChatQuestion(
    businessId: number,
    businessChatQuestionDto: BusinessChatQuestionDto,
  ): Promise<ChatQuestion> {
    try {
      const { question } = businessChatQuestionDto;

      const chatQuestion = await this.questionRepository
        .createQueryBuilder()
        .insert()
        .into(ChatQuestion)
        .values({
          question,
          business: { id: businessId },
        })
        .returning(['id', 'question'])
        .execute();

      return chatQuestion.raw;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChatQuestion(id: number): Promise<ChatQuestion[]> {
    try {
      const chatQuestion = await this.questionRepository
        .createQueryBuilder('question')
        .where('question.business.id = :id', { id })
        .getMany();

      return chatQuestion;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addChatAnswer(
    businessId: number,
    businessChatAnswerDto: BusinessChatAnswerDto,
  ): Promise<ChatAnswer> {
    try {
      const { answer } = businessChatAnswerDto;

      const chatAnswer = await this.answerRepository
        .createQueryBuilder()
        .insert()
        .into(ChatAnswer)
        .values({
          answer,
          business: { id: businessId },
        })
        .returning(['id', 'answer'])
        .execute();

      return chatAnswer.raw;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChatAnswer(id: number): Promise<ChatAnswer[]> {
    try {
      const chatAnswer = await this.answerRepository
        .createQueryBuilder('answer')
        .where('answer.business.id = :id', { id })
        .getMany();

      return chatAnswer;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteChatQuestion(id: number): Promise<DeleteResult> {
    try {
      return await this.questionRepository.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteChatAnswer(id: number): Promise<DeleteResult> {
    try {
      return await this.answerRepository.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
