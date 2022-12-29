import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Business } from 'modules/business/entity/business.entity';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { createTransport } from 'nodemailer';
import { Repository } from 'typeorm';
import { EmailDto } from './dto/login-user.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { User } from './entity/user.entity';
import {
  FAIL_PASSWORD_RESET,
  SEND_PASSWORD_RESET,
  SUCCESSFULLY_DELETE_USER,
  SUCCESSFULLY_PASSWORD_RESET,
} from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(UserBusiness)
    private readonly roleRepository: Repository<UserBusiness>,
  ) {}

  async sendToken(userEmail: EmailDto): Promise<{ message: string }> {
    try {
      const { email } = userEmail;

      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (!user) {
        throw new HttpException(SEND_PASSWORD_RESET, HttpStatus.OK);
      }

      const newToken = randomUUID();

      await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({ passwordResetToken: newToken })
        .where('id = :id', { id: user.id })
        .execute();

      const transporter = createTransport({
        host: `${process.env.MAIL_HOST}`,
        port: +process.env.MAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: `${process.env.SENDER_MAIL}`,
          pass: `${process.env.SENDER_PASSWORD}`,
        },
      });

      await transporter.sendMail({
        from: `"WeHost" <${process.env.SENDER_MAIL}>`, // sender address
        to: `${email}`,
        subject: 'Password reset',
        html: `
          <div style="border: #02528A solid 2px; width: 90%; max-width:450px; border-radius: 15px; text-align: center; padding: 15px; margin: 0 auto;">
              <h2> You requested a password reset </h2>
              <p> To reset your password, click the button </p>
              <a style="color:#fff; font-size: 25px; border-radius: 5px; padding: 15px; background-color: #02528A; display: block;" href="${process.env.BASIC_URL}:${process.env.PORT}/api/user/recover-password?email=${email}&token=${newToken}">Reset</a>
          </div>
        `, // html body
      });

      return {
        message: SEND_PASSWORD_RESET,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async recoverPassword(
    password: RecoverPasswordDto,
    email: string,
    token: string,
  ): Promise<{ message: string }> {
    try {
      const { newPassword } = password;
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .andWhere('user.passwordResetToken = :token', { token })
        .getOne();

      if (!user) {
        throw new HttpException(FAIL_PASSWORD_RESET, HttpStatus.FORBIDDEN);
      }

      const salt = await genSalt(+process.env.SALT_VALUE);
      user.passwordResetToken = null;
      user.password = await hash(newPassword, salt);
      await this.userRepository.update(user.id, user);

      return {
        message: SUCCESSFULLY_PASSWORD_RESET,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    try {
      await this.userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('id = :id', { id })
        .execute();

      return {
        message: SUCCESSFULLY_DELETE_USER,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
