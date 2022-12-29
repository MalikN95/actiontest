import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  businessId: number;

  @IsOptional()
  @IsInt()
  businessObjectId: number;

  @IsOptional()
  @IsString()
  email: string;
}
