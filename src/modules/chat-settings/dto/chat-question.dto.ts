import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class BusinessChatQuestionDto {
  @IsString()
  @MaxLength(40)
  @ApiProperty({
    description: 'Business Chat Question',
  })
  question: string;
}
