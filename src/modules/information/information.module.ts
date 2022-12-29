import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { Gallery } from 'modules/business/entity/gallery.entity';
import { FilesModule } from 'modules/files/files.module';
import { Services } from 'modules/services/entity/services.entity';
import { InformationController } from './information.controller';
import { InformationService } from './information.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, Gallery, Services]),
    FilesModule,
  ],
  controllers: [InformationController],
  providers: [InformationService],
})
export class InformationModule {}
