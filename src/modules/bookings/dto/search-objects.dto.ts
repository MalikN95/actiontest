import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchObjectDto {
  @IsString()
  @ApiProperty({
    description: 'Business object name',
  })
  searchValue: string;
}
