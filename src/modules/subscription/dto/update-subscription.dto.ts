import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BusinessTypesEnum } from 'modules/business/enums/business.enum';

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'Business Name',
  })
  @IsOptional()
  @IsString()
  businessName: string;

  @ApiProperty({
    description: 'Address',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Type of business',
  })
  @IsOptional()
  @IsEnum(BusinessTypesEnum)
  businessType: BusinessTypesEnum;

  @ApiProperty({
    description: 'Subscriptions status',
  })
  @IsOptional()
  active: boolean;

  @ApiProperty({
    description: 'New subscription has not been seen',
  })
  @IsOptional()
  adminHasNotSeen: boolean;

  @ApiProperty({
    description: 'Subscriptions end date',
  })
  @IsOptional()
  endDate: string;
}
