import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { User } from 'modules/user/entity/user.entity';
import { UserController } from 'modules/user/user.controller';
import { UserService } from 'modules/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Business, UserBusiness])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
