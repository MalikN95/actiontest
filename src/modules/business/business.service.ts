import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { Booking } from 'modules/bookings/entity/booking.entity';
import { Chat } from 'modules/chat/entity/chat.entity';
import { OrderByDto } from 'modules/dto/order-by.dto';
import { PaginationDto } from 'modules/dto/pagination.dto';
import { RoleEnum } from 'modules/user/enums/role.enum';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { DeleteResult, Repository } from 'typeorm';
import { MessageView } from 'modules/chat/entity/message-view.entity';
import { SearchBusinessDto } from './dto/search-business.dto';
import { Business } from './entity/business.entity';
import { BusinessObject } from './entity/business-object.entity';
import { BusinessViewHistory } from './entity/business-view.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(BusinessObject)
    private readonly objectRepository: Repository<BusinessObject>,
    @InjectRepository(UserBusiness)
    private readonly userBusinessRoleRepository: Repository<UserBusiness>,
    @InjectRepository(BusinessViewHistory)
    private readonly businessViewHistoryRepository: Repository<BusinessViewHistory>,
  ) {}

  async getBusinessConfiguration(id: number): Promise<Business> {
    try {
      const businessConfiguration = this.businessRepository
        .createQueryBuilder('business')
        .select([
          'business.id',
          'business.businessName',
          'business.address',
          'business.businessType',
          'business.logotypeUrl',
          'business.backgroundUrl',
        ])
        .where('business.id = :id', { id })
        .leftJoinAndSelect('business.businessObject', 'businessObject')
        .getOne();

      return businessConfiguration;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUserBusiness(req: AuthRequest): Promise<Business[]> {
    try {
      const { id, adminRole } = req.user;

      if (adminRole === RoleEnum.APP_OPERATOR) {
        return await this.businessRepository
          .createQueryBuilder('business')
          .select([
            'business.id',
            'business.businessName',
            'business.address',
            'business.backgroundUrl',
            'business.logotypeUrl',
          ])
          .getMany();
      }

      const userBusinessList = await this.businessRepository
        .createQueryBuilder('business')
        .leftJoinAndSelect('business.userBusiness', 'userBusiness')
        .leftJoinAndSelect('userBusiness.user', 'user')
        .select([
          'business.id',
          'business.businessName',
          'business.address',
          'business.backgroundUrl',
          'business.logotypeUrl',
        ])
        .where('user.id = :id', { id })
        .andWhere('userBusiness.role != :role', {
          role: RoleEnum.GUEST,
        })
        .getMany();

      return userBusinessList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBusinessSubscription(id: number): Promise<Business> {
    try {
      const businessSubscription = await this.businessRepository
        .createQueryBuilder('business')
        .where('business.id = :id', { id })
        .leftJoinAndSelect('business.subscription', 'subscription')
        .getOne();

      return businessSubscription;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBusinessInformation(
    id: number,
    req: AuthRequest,
  ): Promise<Business> {
    try {
      this.businessViewUpdate(id, req);
      const businessInformation = await this.businessRepository
        .createQueryBuilder('business')
        .select([
          'business.id',
          'business.businessName',
          'business.galleryActive',
          'business.aboutActive',
          'business.aboutTitle',
          'business.aboutDescription',
          'business.aboutImgUrl',
          'business.wifiActive',
          'business.wifiName',
          'business.wifiPassword',
          'business.amenitiesActive',
          'business.amenitiesTitle',
          'business.amenitiesDescription',
        ])
        .where('business.id = :id', { id })
        .leftJoinAndSelect('business.services', 'services')
        .leftJoinAndSelect('business.gallery', 'gallery')
        .getOne();

      return businessInformation;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBusinessObjects(id: number): Promise<Business> {
    try {
      const businessObjs = await this.businessRepository
        .createQueryBuilder('business')
        .where('business.id = :id', { id })
        .leftJoinAndSelect('business.explore', 'explore')
        .getOne();

      return businessObjs;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBusinessExplore(id: number, req: AuthRequest): Promise<Business> {
    try {
      this.businessViewUpdate(id, req);
      const businessExplore = await this.businessRepository
        .createQueryBuilder('business')
        .select(['business.id', 'business.businessName'])
        .where('business.id = :id', { id })
        .leftJoinAndSelect('business.explore', 'explore')
        .getOne();

      return businessExplore;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBusinessChatSetting(id: number): Promise<Business> {
    try {
      const businessExplore = await this.businessRepository
        .createQueryBuilder('business')
        .select(['business.id', 'business.businessName', 'business.chatColor'])
        .where('business.id = :id', { id })
        .leftJoinAndSelect('business.chatAnswer', 'chatAnswer')
        .leftJoinAndSelect('business.chatQuestion', 'chatQuestion')
        .getOne();

      return businessExplore;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBusinessChatList(
    id: number,
  ): Promise<{ general: Chat[]; objectList: BusinessObject[] }> {
    try {
      const date = new Date();
      const businessChatList = await this.businessRepository
        .createQueryBuilder('business')
        .select(['business.id', 'business.businessName', 'business.chatColor'])
        .where('business.id = :id', { id })
        .leftJoinAndSelect('business.chat', 'chat')
        .leftJoinAndSelect('chat.businessObject', 'businessObject')
        .leftJoin('chat.user', 'user')
        .addSelect(['user.id', 'user.name', 'user.email'])
        .leftJoinAndMapMany(
          'user.booking',
          Booking,
          'booking',
          'booking.checkOut >= :date and booking.user.id = user.id',
          { date },
        )
        .leftJoinAndSelect('booking.businessObject', 'businessObject')
        .getOne();

      const objectList = await this.objectRepository
        .createQueryBuilder('object')
        .where('object.business.id= :id', { id })
        .select(['object.objectName', 'object.id'])
        .getMany();

      for (const object of objectList) {
        object['chats'] = [];
      }

      const general: Chat[] = [];
      for (const chat of businessChatList.chat) {
        if (!chat.user.booking.length) {
          general.push(chat);
        } else {
          const idx = objectList.findIndex(
            (obj) => obj.id === chat.user.booking[0].businessObject.id,
          );
          delete chat.user.booking;
          objectList[idx]['chats'].push(chat);
        }
      }
      return {
        general,
        objectList,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllBusiness(
    searchBusinessDto: SearchBusinessDto,
    orderBy: OrderByDto,
    paginationDto: PaginationDto,
  ): Promise<{ business: UserBusiness[]; total: number }> {
    const { searchValue } = searchBusinessDto;
    const { sortColumn, order } = orderBy;
    const { skipPages, pageSize } = paginationDto;

    try {
      const [business, total] = await this.userBusinessRoleRepository
        .createQueryBuilder('userBusiness')
        .leftJoin('userBusiness.business', 'business')
        .leftJoinAndSelect('business.subscription', 'subscription')
        .leftJoinAndMapOne(
          'userBusiness.user',
          'userBusiness.user',
          'user',
          'userBusiness.role = :role',
          {
            role: RoleEnum.KEY_USER,
          },
        )
        .addSelect([
          'business.id',
          'business.businessName',
          'user.email',
          'business.address',
          'business.businessType',
          'business.updatedAt',
        ])
        .where('business.businessName ILIKE :businessName', {
          businessName: `%${searchValue}%`,
        })
        .orWhere('user.email ILIKE :userEmail', {
          userEmail: `%${searchValue}%`,
        })
        .orderBy(`${sortColumn}`, order)
        .skip(pageSize * skipPages)
        .take(pageSize)
        .getManyAndCount();

      return { business, total };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBusiness(id: number): Promise<DeleteResult> {
    try {
      const deleteResult = await this.businessRepository
        .createQueryBuilder('business')
        .leftJoinAndSelect('business.subscription', 'subscription')
        .delete()
        .from(Business)
        .where('id = :id', { id })
        .execute();

      return deleteResult;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchBusiness(
    pageSize: number,
    skipPages: number,
    searchBusinessDto: SearchBusinessDto,
  ): Promise<{ business: Business[]; count: number }> {
    try {
      const { searchValue } = searchBusinessDto;
      const [business, count] = await this.businessRepository
        .createQueryBuilder('business')
        .orderBy('business.createdAt', 'DESC')
        .where('business.businessName ILIKE :searchValue', {
          searchValue: `%${searchValue}%`,
        })
        .select([
          'business.id',
          'business.businessName',
          'business.address',
          'business.backgroundUrl',
          'business.logotypeUrl',
        ])
        .skip(pageSize * skipPages)
        .take(pageSize)
        .getManyAndCount();

      return {
        business,
        count,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unreadMessageBusiness(req: AuthRequest): Promise<Business[]> {
    try {
      const { id } = req.user;
      const businessList = await this.businessRepository
        .createQueryBuilder('business')
        .leftJoinAndSelect('business.userBusiness', 'userBusiness')
        .leftJoinAndSelect('business.chat', 'chat')
        .leftJoinAndMapOne(
          'chat.messageView',
          MessageView,
          'messageView',
          'messageView.chat.id = chat.id and messageView.user.id = :userId',
          { userId: id },
        )
        .leftJoinAndSelect(
          'chat.message',
          'message',
          'message.id > messageView.message',
        )
        .where('userBusiness.user.id = :id', { id })
        .andWhere('userBusiness.role != :role', { role: RoleEnum.ADMIN })
        .andWhere('userBusiness.role != :role', { role: RoleEnum.KEY_USER })
        .getMany();

      if (businessList.length) {
        let unreadMessage = 0;
        for (const business of businessList) {
          for (const messageCount of business.chat) {
            unreadMessage += messageCount.message.length;
          }
          delete business.chat;
          business['unreadMessage'] = unreadMessage;
          unreadMessage = 0;
        }
      }

      return businessList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async businessViewUpdate(
    businessId: number,
    req: AuthRequest,
  ): Promise<void> {
    try {
      await this.businessViewHistoryRepository
        .createQueryBuilder('businessViewHistory')
        .insert()
        .into(BusinessViewHistory)
        .values({
          user: { id: req.user.id },
          business: { id: businessId },
        })
        .orUpdate({
          conflict_target: ['userId', 'businessId'],
          overwrite: ['lastView'],
        })
        .execute();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
