import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { Subscription } from './entity/subscription.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, UserBusiness])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
