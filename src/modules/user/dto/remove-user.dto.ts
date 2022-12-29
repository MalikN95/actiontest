import { IsInt } from 'class-validator';
import { EmailDto } from './login-user.dto';

export class RemoveUserDto extends EmailDto {
  @IsInt()
  businessId: number;
}
