import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { FilesModule } from 'modules/files/files.module';
import { Explore } from './entity/explore.entity';
import { ExploreController } from './explore.controller';
import { ExploreService } from './explore.service';

@Module({
  imports: [TypeOrmModule.forFeature([Business, Explore]), FilesModule],
  controllers: [ExploreController],
  providers: [ExploreService],
})
export class ExploreModule {}
