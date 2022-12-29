import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { UpdateSubscriptionDto } from 'modules/subscription/dto/update-subscription.dto';
import { RoleEnum } from 'modules/user/enums/role.enum';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entity/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(UserBusiness)
    private readonly roleRepository: Repository<UserBusiness>,
  ) {}

  async updateSubscription(
    businessId: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    try {
      const subscription = await this.subscriptionRepository
        .createQueryBuilder('subscription')
        .leftJoinAndSelect('subscription.business', 'business')
        .update(Subscription)
        .set({ ...updateSubscriptionDto })
        .where('business.id = :businessId', { businessId })
        .execute();

      return subscription.raw[0];
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async newSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    req: AuthRequest,
  ): Promise<Subscription> {
    try {
      // Generate starting date (now) and end date (one year from now)
      const subscriptionDate = new Date();
      const endDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      );

      const { id } = req.user;

      const newBusiness = await this.subscriptionRepository.save({
        subscriptionDate,
        endDate,
        adminHasNotSeen: true,
        business: {
          ...createSubscriptionDto,
        },
      });

      await this.roleRepository.save({
        business: newBusiness.business,
        user: { id },
        role: RoleEnum.KEY_USER,
      });

      return newBusiness;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
