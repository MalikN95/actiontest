import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { BusinessTypesEnum } from 'modules/business/enums/business.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Business Name',
  })
  @IsString()
  businessName: string;

  @ApiProperty({
    description: 'Address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Type of business',
  })
  @IsEnum(BusinessTypesEnum)
  businessType: BusinessTypesEnum;
}
