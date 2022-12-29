import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { Business } from 'modules/business/entity/business.entity';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { PaginationDto } from 'modules/dto/pagination.dto';
import { User } from 'modules/user/entity/user.entity';
import { RoleEnum } from 'modules/user/enums/role.enum';
import { DeleteResult, Repository } from 'typeorm';
import { MessageView } from 'modules/chat/entity/message-view.entity';
import { createTransport } from 'nodemailer';
import { BookingDto } from './dto/booking.dto';
import { SearchBookingDto } from './dto/search-booking.dto';
import { SearchObjectDto } from './dto/search-objects.dto';
import { Booking } from './entity/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BusinessObject)
    private readonly objectRepository: Repository<BusinessObject>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(req: AuthRequest, bookingId: number): Promise<Booking> {
    try {
      const { email } = req.user;

      const booking = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.businessObject', 'businessObject')
        .leftJoinAndSelect('businessObject.business', 'business')
        .leftJoinAndSelect('business.userBusiness', 'userBusiness')
        .leftJoinAndMapOne(
          'userBusiness.user',
          'userBusiness.user',
          'user',
          'userBusiness.role = :role',
          {
            role: RoleEnum.KEY_USER,
          },
        )
        .where('booking.id = :bookingId', { bookingId })
        .andWhere('user.email = :email', { email })
        .getOne();

      if (!booking) throw new NotFoundException();

      return booking;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBusinessBookings(
    businessId: number,
    paginationDto: PaginationDto,
  ): Promise<Booking[]> {
    const { skipPages, pageSize } = paginationDto;

    try {
      const bookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.businessObject', 'businessObject')
        .where('businessObject.business.id = :businessId', { businessId })
        .orderBy('booking.createdAt', 'DESC')
        .skip(pageSize * skipPages)
        .take(pageSize)
        .getMany();

      return bookings;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBusinessBookings(
    businessId: number,
    searchBookingDto: SearchBookingDto,
    paginationDto: PaginationDto,
  ): Promise<{ bookings: Booking[]; total: number }> {
    const { searchValue } = searchBookingDto;
    const { skipPages, pageSize } = paginationDto;

    try {
      const [bookings, total] = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.businessObject', 'businessObject')
        .leftJoinAndSelect('businessObject.business', 'business')
        .orderBy('booking.createdAt', 'DESC')
        .where('business.id = :businessId', { businessId })
        .andWhere(
          '(user.name ILIKE :searchValue OR user.email ILIKE :searchValue)',
          { searchValue: `%${searchValue}%` },
        )
        .skip(pageSize * skipPages)
        .take(pageSize)
        .getManyAndCount();

      return { bookings, total };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBusinessObjects(id: number): Promise<BusinessObject[]> {
    try {
      const businessObjects = await this.objectRepository
        .createQueryBuilder('object')
        .where('object.business.id = :id', { id })
        .getMany();

      return businessObjects;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBusinessObjects(
    id: number,
    searchObjectDto: SearchObjectDto,
  ): Promise<BusinessObject[]> {
    try {
      const { searchValue } = searchObjectDto;
      const businessObjects = await this.objectRepository
        .createQueryBuilder('object')
        .where('object.business.id = :id', { id })
        .andWhere('object.objectName ILIKE :searchValue', {
          searchValue: `%${searchValue}%`,
        })
        .getMany();

      return businessObjects;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addBooking(bookingDto: BookingDto): Promise<Booking> {
    try {
      const { checkIn, checkOut, businessObjectId, guestEmail } = bookingDto;

      if (checkIn > checkOut) throw new ForbiddenException();

      const guest = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: guestEmail })
        .getOne();

      if (!guest) {
        await this.userRepository.save({ email: guestEmail });
      }

      const transporter = createTransport({
        host: `${process.env.MAIL_HOST}`,
        port: +process.env.MAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: `${process.env.SENDER_MAIL}`,
          pass: `${process.env.SENDER_PASSWORD}`,
        },
      });

      await transporter.sendMail({
        from: `"WeHost" <${process.env.SENDER_MAIL}>`, // sender address
        to: `${guestEmail}`,
        subject: 'Booking info',
        html: `
          <div style="border: #02528A solid 2px; width: 90%; max-width:450px; border-radius: 15px; text-align: center; padding: 15px; margin: 0 auto;">
              <h2> Please download Wehost App</h2>
              <p> To reset your password, click the button </p>
              <a style="color:#fff; font-size: 25px; border-radius: 5px; padding: 15px; background-color: #02528A; display: block;" href="#">Link</a>
          </div>
        `, // html body
      });

      return await this.bookingRepository.save({
        businessObject: { id: businessObjectId },
        checkIn,
        checkOut,
        user: guest,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeBooking(
    req: AuthRequest,
    bookingId: number,
  ): Promise<DeleteResult> {
    try {
      await this.findOne(req, bookingId);

      const deletedBooking = await this.bookingRepository
        .createQueryBuilder('bookings')
        .delete()
        .from(Booking)
        .where('id = :bookingId', { bookingId })
        .execute();

      return deletedBooking;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async userAllBookings(req: AuthRequest): Promise<Booking[]> {
    try {
      const date = new Date();

      const bookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.user.id = :id', { id: req.user.id })
        .leftJoin('booking.user', 'user')
        .orderBy('booking.checkOut', 'DESC')
        .leftJoin('booking.businessObject', 'businessObject')
        .addSelect('businessObject.id')
        .leftJoin('businessObject.business', 'business')
        .leftJoin('business.chat', 'chat')
        .leftJoinAndMapOne(
          'chat.messageView',
          MessageView,
          'messageView',
          'messageView.chat.id = chat.id and messageView.user.id = user.id',
        )
        .leftJoinAndSelect(
          'chat.message',
          'message',
          'message.id > messageView.message',
        )
        .addSelect([
          'business.id',
          'business.businessName',
          'business.address',
          'business.backgroundUrl',
          'business.logotypeUrl',
          'chat.id',
        ])
        .getMany();

      if (bookings) {
        let unreadMessage = 0;
        for (const booking of bookings) {
          if (booking.checkOut > date) {
            booking.isBooking = true;
          } else {
            booking.isBooking = false;
          }
          for (const messageCount of booking.businessObject.business.chat) {
            unreadMessage += messageCount.message.length;
          }
          delete booking.businessObject.business.chat;
          booking['unreadMessage'] = unreadMessage;
          unreadMessage = 0;
        }
      }

      return bookings;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
