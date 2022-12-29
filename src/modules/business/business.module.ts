import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { Business } from './entity/business.entity';
import { BusinessObject } from './entity/business-object.entity';
import { BusinessViewHistory } from './entity/business-view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Business,
      BusinessObject,
      UserBusiness,
      BusinessViewHistory,
    ]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
