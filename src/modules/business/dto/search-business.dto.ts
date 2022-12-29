import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchBusinessDto {
  @IsString()
  @ApiProperty({
    description: 'Business (Hotel or other) name',
  })
  searchValue: string;
}
