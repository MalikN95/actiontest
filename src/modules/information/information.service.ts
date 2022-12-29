import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { Gallery } from 'modules/business/entity/gallery.entity';
import { FilesService } from 'modules/files/files.service';
import { CreateInformationDto } from 'modules/information/dto/create-information.dto';
import { UpdateInformationDto } from 'modules/information/dto/update-information.dto';
import { Services } from 'modules/services/entity/services.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InformationService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    private readonly fileService: FilesService,
  ) {}

  async addInformation(
    informationDto: CreateInformationDto,
  ): Promise<Business> {
    try {
      const {
        businessId,
        galleryActive,
        aboutActive,
        wifiActive,
        amenitiesActive,
        aboutTitle,
        aboutDescription,
        aboutImgUrl,
        wifiName,
        wifiPassword,
        amenitiesTitle,
        amenitiesDescription,
        businessServices,
      } = informationDto;

      if (businessServices)
        await this.servicesRepository.save([...businessServices]);

      const businessInfo = await this.businessRepository
        .createQueryBuilder()
        .update(Business)
        .set({
          galleryActive,
          aboutActive,
          wifiActive,
          amenitiesActive,
          aboutTitle,
          aboutDescription,
          aboutImgUrl,
          wifiName,
          wifiPassword,
          amenitiesTitle,
          amenitiesDescription,
        })
        .where('id = :businessId', { businessId })
        .execute();

      return businessInfo.raw[0];
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateInformation(
    businessId: number,
    informationDto: UpdateInformationDto,
  ): Promise<Business> {
    try {
      const {
        galleryActive,
        aboutActive,
        wifiActive,
        amenitiesActive,
        aboutTitle,
        aboutDescription,
        aboutImgUrl,
        wifiName,
        wifiPassword,
        amenitiesTitle,
        amenitiesDescription,
        businessServices,
      } = informationDto;

      if (businessServices)
        await this.servicesRepository.save([...businessServices]);

      const businessInfo = await this.businessRepository
        .createQueryBuilder()
        .update(Business)
        .set({
          galleryActive,
          aboutActive,
          wifiActive,
          amenitiesActive,
          aboutTitle,
          aboutDescription,
          aboutImgUrl,
          wifiName,
          wifiPassword,
          amenitiesTitle,
          amenitiesDescription,
        })
        .where('id = :businessId', { businessId })
        .execute();

      return businessInfo.raw[0];
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async findImageByKey(imageKey: string): Promise<Business> {
    try {
      const business = await this.businessRepository
        .createQueryBuilder('business')
        .where('business.aboutImgUrl = :imageKey', { imageKey })
        .getOne();

      return business;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addAboutImage(file: Express.Multer.File): Promise<{ fileUrl: string }> {
    try {
      const upload = await this.fileService.uploadFile(file, 'about');
      return { fileUrl: upload.key };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeAboutImage(key: string): Promise<Business> {
    try {
      await this.fileService.deleteFile(key);

      const business = await this.findImageByKey(key);

      if (!business) throw new NotFoundException();

      const updatedBusiness = await this.businessRepository
        .createQueryBuilder()
        .update(Business)
        .set({
          ...business,
          aboutImgUrl: null,
        })
        .where('id = :id', { id: business.id })
        .execute();

      return updatedBusiness.raw[0];
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadGallery(
    file: Express.Multer.File,
    businessId: number,
  ): Promise<Gallery> {
    try {
      const url = 'gallery';
      const upload = await this.fileService.uploadFile(file, url);

      return await this.galleryRepository.save({
        imgUrl: upload.key,
        business: { id: businessId },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteGalleryImg(id: number): Promise<void> {
    try {
      const key = await this.galleryRepository.findOneBy({ id });

      await this.fileService.deleteFile(key.imgUrl);
      await this.galleryRepository.delete({ id });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
