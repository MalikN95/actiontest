import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  @ApiProperty({ description: 'The number of pages to skip to' })
  skipPages: number;

  @Type(() => Number)
  @ApiProperty({ description: 'The number of items to return' })
  @IsPositive()
  pageSize: number;
}
