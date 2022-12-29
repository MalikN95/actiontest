import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ExploreTypesEnum } from '../enums/explore.enum';

export class ExploreDto {
  @ApiProperty({
    description: 'Explore Id',
  })
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty({
    description: 'Explore Title',
  })
  @IsString()
  exploreTitle: string;

  @ApiProperty({
    description: 'Explore Description',
  })
  @IsString()
  exploreDescription: string;

  @ApiProperty({
    description: 'Explore Type',
  })
  @IsString()
  exploreType: ExploreTypesEnum;

  @ApiProperty({
    description: 'Explore Image Url',
  })
  @IsString()
  @IsOptional()
  imageUrl: string;
}
