import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'modules/files/files.service';
import { DeleteResult, Repository } from 'typeorm';
import { Services } from './entity/services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
    private readonly fileService: FilesService,
  ) {}

  private async findImageByKey(imageKey: string): Promise<Services> {
    try {
      const services = await this.servicesRepository
        .createQueryBuilder('services')
        .where('services.imageUrl = :imageKey', { imageKey })
        .getOne();

      return services;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addImage(file: Express.Multer.File): Promise<{ fileUrl: string }> {
    try {
      const upload = await this.fileService.uploadFile(file, 'services');
      return { fileUrl: upload.key };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeImage(key: string): Promise<Services> {
    try {
      await this.fileService.deleteFile(key);

      const services = await this.findImageByKey(key);

      if (!services) throw new NotFoundException();

      const updatedServices = await this.servicesRepository
        .createQueryBuilder()
        .update(Services)
        .set({
          ...services,
          imageUrl: null,
        })
        .where('id = :id', { id: services.id })
        .execute();

      return updatedServices.raw[0];
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteService(id: number): Promise<DeleteResult> {
    try {
      const service = await this.servicesRepository.findOneBy({ id });

      if (service.imageUrl) {
        await this.fileService.deleteFile(service.imageUrl);
      }
      return this.servicesRepository.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
