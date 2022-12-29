import { IsEmail, IsEnum, IsInt, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'modules/user/enums/role.enum';

export class AssignRoleDto {
  @IsEmail()
  /** RFC 3696 - Section 3 */
  @Length(3, 320)
  @ApiProperty({
    description:
      'The email address of the user, has 3 to 320 characters according to RFC 3696',
    example: 'admin@mail.wehost',
  })
  email: string;

  @IsInt()
  businessId: number;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}
