import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchBookingDto {
  @IsString()
  @ApiProperty({
    description: 'User name or email',
  })
  searchValue: string;
}
