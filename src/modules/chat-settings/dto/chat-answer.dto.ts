import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class BusinessChatAnswerDto {
  @IsString()
  @MaxLength(40)
  @ApiProperty({
    description: 'Business Chat Answer',
  })
  answer: string;
}
