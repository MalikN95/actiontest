import { IsInt } from 'class-validator';

export class MessageViewDto {
  @IsInt()
  userId: number;

  @IsInt()
  chatId: number;

  @IsInt()
  messageId: number;
}
