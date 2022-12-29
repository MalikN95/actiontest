import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'modules/user/entity/user.entity';
import { Business } from 'modules/business/entity/business.entity';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { UserBusinessRoleService } from './user-business-role.service';
import { UserBusinessRoleController } from './user-business-role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserBusiness, User, Business])],
  controllers: [UserBusinessRoleController],
  providers: [UserBusinessRoleService],
})
export class UserBusinessRoleModule {}
