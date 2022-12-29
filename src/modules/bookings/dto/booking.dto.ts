import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNumber } from 'class-validator';

export class BookingDto {
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Check-in date',
    example: '2022-11-08',
  })
  checkIn: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Check-Out date',
    example: '2022-11-10',
  })
  checkOut: Date;

  @IsNumber()
  @ApiProperty({
    description: 'Business object id',
  })
  businessObjectId: number;

  @IsEmail()
  @ApiProperty({
    description: 'Guest email',
  })
  guestEmail: string;
}
