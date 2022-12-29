import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'modules/user/entity/user.entity';
import { ILoginRes } from 'modules/auth/interfaces/login-res.interface';
import { TokenPayload } from 'modules/auth/interfaces/token-payload.interface';
import {
  EMAIL_IS_USE,
  WRONG_EMAIL_OR_PASSWORD,
} from 'modules/auth/auth.constants';
import { LoginDto } from 'modules/auth/dto/login.dto';
import { RegisterDto } from 'modules/auth/dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Booking } from 'modules/bookings/entity/booking.entity';
import { RoleEnum } from 'modules/user/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserFromAuthToken(token: string): Promise<User> {
    try {
      const { id }: TokenPayload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });

      return await this.userRepository.findOneBy({ id });
    } catch (err) {
      throw new WsException(err);
    }
  }

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const { name, email, password } = registerDto;
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (user && user.password) {
        throw new UnauthorizedException(EMAIL_IS_USE);
      }

      const salt = await genSalt(+process.env.SALT_VALUE);
      const newPassword = await hash(password, salt);

      if (user && !user.password) {
        const updateUser = await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            name,
            password: newPassword,
          })
          .where('id = :id', { id: user.id })
          .execute();

        return updateUser.raw[0];
      }

      return this.userRepository.save({
        name,
        email,
        password: newPassword,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    try {
      const { email, password } = loginDto;
      const date = new Date();
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .andWhere('user.password IS NOT NULL')
        .leftJoinAndMapMany(
          'user.booking',
          Booking,
          'booking',
          'booking.checkOut >= :date and booking.user.id = user.id',
          { date },
        )
        .getOne();

      if (!user) {
        throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
      }

      const isCorrectPassword = await compare(password, user.password);

      if (!isCorrectPassword) {
        throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD);
      }

      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateAdmin(user: User): Promise<ILoginRes> {
    try {
      if (user.adminRole !== RoleEnum.APP_OPERATOR) {
        throw new UnauthorizedException();
      }

      return await this.login(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(user: User): Promise<ILoginRes> {
    try {
      const tokenPayload: TokenPayload = {
        email: user.email,
        id: user.id,
        name: user.name,
        adminRole: user.adminRole,
        activeBookingCount: user.booking.length,
      };

      return {
        tokenPayload,
        accessToken: this.jwtService.sign(tokenPayload),
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
