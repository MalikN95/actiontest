import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class EmailDto {
  @IsEmail()
  /** RFC 3696 - Section 3 */
  @Length(3, 320)
  @ApiProperty({
    description:
      'The email address of the user, has 3 to 320 characters according to RFC 3696',
    example: 'admin@mail.wehost',
  })
  email: string;
}
