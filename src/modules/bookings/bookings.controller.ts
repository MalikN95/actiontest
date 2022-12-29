import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { BookingsService } from 'modules/bookings/bookings.service';
import { BookingDto } from 'modules/bookings/dto/booking.dto';
import { SearchBookingDto } from 'modules/bookings/dto/search-booking.dto';
import { SearchObjectDto } from 'modules/bookings/dto/search-objects.dto';
import { Booking } from 'modules/bookings/entity/booking.entity';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { PaginationDto } from 'modules/dto/pagination.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  getBusinessBookings(
    @Query('id') id: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<Booking[]> {
    return this.bookingService.getBusinessBookings(id, paginationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  findBusinessBookings(
    @Query('id') businessId: number,
    @Query() searchBookingDto: SearchBookingDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ bookings: Booking[]; total: number }> {
    return this.bookingService.findBusinessBookings(
      businessId,
      searchBookingDto,
      paginationDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-business-objects')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  getBusinessObjects(@Query('id') id: number): Promise<BusinessObject[]> {
    return this.bookingService.getBusinessObjects(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search-business-objects')
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  fingBusinessObjects(
    @Query('id') id: number,
    @Query() searchObjectDto: SearchObjectDto,
  ): Promise<BusinessObject[]> {
    return this.bookingService.findBusinessObjects(id, searchObjectDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  newBooking(@Body() bookingDto: BookingDto): Promise<Booking> {
    return this.bookingService.addBooking(bookingDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':bookingId')
  removeBooking(
    @Req() req: AuthRequest,
    @Param('bookingId') bookingId: number,
  ): Promise<DeleteResult> {
    return this.bookingService.removeBooking(req, bookingId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/all')
  userAllBookings(@Req() req: AuthRequest): Promise<Booking[]> {
    return this.bookingService.userAllBookings(req);
  }
}
