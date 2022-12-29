import {
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { Services } from './entity/services.entity';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesServise: ServicesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add-image')
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ fileUrl: string }> {
    return this.servicesServise.addImage(file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-image/:key')
  removeImage(@Param('key') key: string): Promise<Services> {
    return this.servicesServise.removeImage(key);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'serviceId',
    required: true,
    type: Number,
    description: 'Service id',
  })
  @Delete('delete')
  deleteService(@Query('serviceId') id: number): Promise<DeleteResult> {
    return this.servicesServise.deleteService(id);
  }
}
