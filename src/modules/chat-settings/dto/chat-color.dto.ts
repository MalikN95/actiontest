import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BusinessChatColorEnum } from 'modules/business/enums/business-chat-color.enum';

export class BusinessChatColorDto {
  @IsEnum(BusinessChatColorEnum)
  @ApiProperty({
    description: 'Business Chat Color',
  })
  color: BusinessChatColorEnum;
}
