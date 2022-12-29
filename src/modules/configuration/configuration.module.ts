import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { FilesModule } from 'modules/files/files.module';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessObject, Business]), FilesModule],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
