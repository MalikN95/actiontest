import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class RecoverPasswordDto {
  @Length(8, 20)
  @ApiProperty({
    description: 'New password of the user, has 8 to 20 characters',
    example: 'Abc12345',
  })
  newPassword: string;
}
