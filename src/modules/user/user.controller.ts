import {
  Controller,
  Patch,
  Post,
  Query,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailDto } from 'modules/user/dto/login-user.dto';
import { RecoverPasswordDto } from 'modules/user/dto/recover-password.dto';
import { UserService } from 'modules/user/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('recover-password')
  sendToken(@Body() userEmail: EmailDto): Promise<{ message: string }> {
    return this.userService.sendToken(userEmail);
  }

  @Post('recover-password')
  recoverPassword(
    @Body() password: RecoverPasswordDto,
    @Query('email') email: string,
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    return this.userService.recoverPassword(password, email, token);
  }

  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }
}
