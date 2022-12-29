import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { Business } from 'modules/business/entity/business.entity';
import { AssignRoleDto } from 'modules/user-business-role/dto/assign-role.dto';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { User } from 'modules/user/entity/user.entity';
import { RoleEnum } from 'modules/user/enums/role.enum';
import { createTransport } from 'nodemailer';
import { Repository } from 'typeorm';

@Injectable()
export class UserBusinessRoleService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(UserBusiness)
    private readonly userBusinessRoleRepository: Repository<UserBusiness>,
  ) {}

  async findBusinessAdmins(businessId: number): Promise<UserBusiness[]> {
    try {
      const adminUsers = await this.userBusinessRoleRepository
        .createQueryBuilder('userBusiness')
        .leftJoinAndSelect('userBusiness.user', 'user')
        .leftJoinAndSelect('userBusiness.business', 'business')
        .select(['userBusiness.id', 'user.name', 'user.email'])
        .where('userBusiness.role = :role', { role: RoleEnum.ADMIN })
        .andWhere('business.id = :businessId', {
          businessId,
        })
        .orderBy('userBusiness.id', 'DESC')
        .getMany();

      return adminUsers;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async assignRole(assignRoleDto: AssignRoleDto): Promise<UserBusiness> {
    try {
      const { email, role, businessId } = assignRoleDto;

      const businessAndUser = await this.userBusinessRoleRepository
        .createQueryBuilder('userBusiness')
        .leftJoin('userBusiness.user', 'user')
        .leftJoin('userBusiness.business', 'business')
        .where('user.email = :email', { email })
        .andWhere('business.id = :businessId', {
          businessId,
        })
        .getOne();

      if (businessAndUser) throw new ForbiddenException();

      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      const business = await this.businessRepository
        .createQueryBuilder('business')
        .where('business.id = :businessId', { businessId })
        .getOne();

      if (!business) throw new NotFoundException();

      if (!user && business) {
        const newUser = await this.userRepository.save({ email });

        const updatedRole = await this.userBusinessRoleRepository
          .createQueryBuilder('userBusiness')
          .leftJoin('userBusiness.user', 'user')
          .leftJoin('userBusiness.business', 'business')
          .insert()
          .into(UserBusiness)
          .values({ user: newUser, business: { id: businessId }, role })
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
          from: `"WeHost" <${process.env.SENDER_MAIL}>`,
          to: `${email}`,
          subject: 'Landing page link',
          html: `
            <p>Landing page link</p>
          `,
        });

        return updatedRole.raw[0];
      }

      const updatedRole = await this.userBusinessRoleRepository.save({
        user: { id: user.id },
        business: { id: business.id },
        role,
      });

      return updatedRole;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeUserFromBusiness(
    req: AuthRequest,
    id: number,
  ): Promise<UserBusiness> {
    try {
      const { email } = req.user;

      const businessAndUser = await this.userBusinessRoleRepository
        .createQueryBuilder('userBusiness')
        .leftJoinAndSelect('userBusiness.business', 'business')
        .where('userBusiness.id = :id', { id })
        .getOne();

      if (!businessAndUser) throw new NotFoundException();

      const hasPermission = await this.userBusinessRoleRepository
        .createQueryBuilder('userBusiness')
        .leftJoinAndSelect('userBusiness.user', 'user')
        .leftJoinAndSelect('userBusiness.business', 'business')
        .where('business.id = :businessId', {
          businessId: businessAndUser.business.id,
        })
        .andWhere('user.email = :email', { email })
        .andWhere('userBusiness.role = :role', {
          role: RoleEnum.KEY_USER,
        })
        .getOne();

      if (!hasPermission) throw new UnauthorizedException();

      const deletedUser = await this.userBusinessRoleRepository
        .createQueryBuilder('userBusiness')
        .delete()
        .from(UserBusiness)
        .where('id = :id', { id })
        .execute();

      return deletedUser.raw[0];
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
