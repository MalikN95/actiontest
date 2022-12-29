import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { User } from 'modules/user/entity/user.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entity/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, Booking, BusinessObject, User]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
