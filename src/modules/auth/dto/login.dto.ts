import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Work Email',
    example: 'admin@mail.wehost',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User Password',
    example: 'Abc12345',
  })
  @IsString()
  password: string;
}
