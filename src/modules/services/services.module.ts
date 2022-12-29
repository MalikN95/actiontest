import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { FilesModule } from 'modules/files/files.module';
import { Services } from './entity/services.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Business, Services]), FilesModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
