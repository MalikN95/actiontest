import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'modules/user/entity/user.entity';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeedsService],
  controllers: [SeedsController],
})
export class SeedsModule {}
