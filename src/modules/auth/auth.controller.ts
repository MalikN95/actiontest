import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ILoginRes } from 'modules/auth/interfaces/login-res.interface';
import { User } from 'modules/user/entity/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post('login-admin')
  async loginAdmin(@Body() loginDto: LoginDto): Promise<ILoginRes> {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.validateAdmin(user);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ILoginRes> {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }
}
