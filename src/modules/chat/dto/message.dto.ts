import { IsInt, IsString } from 'class-validator';

export class MessageDto {
  @IsInt()
  chatId: number;

  @IsString()
  content: string;
}
