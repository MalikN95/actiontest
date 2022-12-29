import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'modules/business/entity/business.entity';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { FilesService } from 'modules/files/files.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateConfigurationDto } from 'modules/configuration/dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { UpdateObjectDto } from './dto/update-object.dto';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(BusinessObject)
    private readonly objectRepository: Repository<BusinessObject>,
    private readonly fileService: FilesService,
  ) {}

  async updateBusinessConfiguration(
    id: number,
    updateConfigurationDto: UpdateConfigurationDto,
  ): Promise<void> {
    try {
      const { businessName, businessAdress } = updateConfigurationDto;

      const configuration = new Business();
      configuration.businessName = businessName;
      configuration.address = businessAdress;

      await this.businessRepository.update(id, configuration);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBusinessObject(
    updateObjectDto: UpdateObjectDto[],
  ): Promise<void> {
    try {
      for (const object of updateObjectDto) {
        const { id, objectName, location, wifiName, wifiPassword } = object;
        const updatedObject = new BusinessObject();
        updatedObject.objectName = objectName;
        updatedObject.location = location;
        updatedObject.wifiName = wifiName;
        updatedObject.wifiPassword = wifiPassword;
        this.objectRepository.update(id, updatedObject);
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addBusinessObject(
    createConfigurationDto: CreateConfigurationDto,
  ): Promise<BusinessObject[]> {
    try {
      const { businessId, businessName, address, businessObjects } =
        createConfigurationDto;

      const uniqueBusinessObjects = new Set(
        businessObjects.map(({ objectName }) => objectName),
      );

      if (uniqueBusinessObjects.size < businessObjects.length) {
        throw new HttpException(
          'Object name already in use',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.businessRepository
        .createQueryBuilder()
        .update(Business)
        .set({
          address,
          businessName,
        })
        .where('id = :businessId', { businessId })
        .execute();

      const addedObjects = await this.objectRepository.save([
        ...createConfigurationDto.businessObjects,
      ]);

      return addedObjects;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBusinessObject(id: number): Promise<DeleteResult> {
    try {
      return this.objectRepository.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateLogotype(
    file: Express.Multer.File,
    id: number,
  ): Promise<UpdateResult> {
    try {
      const url = 'logotype';
      const upload = await this.fileService.uploadFile(file, url);

      return await this.businessRepository.update(id, {
        logotypeUrl: upload.key,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBackground(
    file: Express.Multer.File,
    id: number,
  ): Promise<UpdateResult> {
    try {
      const url = 'background';
      const upload = await this.fileService.uploadFile(file, url);

      return await this.businessRepository.update(id, {
        backgroundUrl: upload.key,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async findBusinessImageByKey(imageKey: string): Promise<Business> {
    try {
      const business = await this.businessRepository
        .createQueryBuilder('business')
        .where('business.backgroundUrl = :imageKey', { imageKey })
        .orWhere('business.logotypeUrl = :imageKey', { imageKey })
        .getOne();

      return business;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeImage(
    key: string,
    imageType: 'logotype' | 'background',
  ): Promise<Business> {
    try {
      await this.fileService.deleteFile(key);

      const business = await this.findBusinessImageByKey(key);

      if (!business) throw new NotFoundException();

      if (imageType === 'background') {
        const updatedBusiness = await this.businessRepository
          .createQueryBuilder()
          .update(business)
          .set({
            ...business,
            backgroundUrl: null,
          })
          .where('id = :id', { id: business.id })
          .execute();

        return updatedBusiness.raw[0];
      }

      const updatedBusiness = await this.businessRepository
        .createQueryBuilder()
        .update(business)
        .set({
          ...business,
          logotypeUrl: null,
        })
        .where('id = :id', { id: business.id })
        .execute();

      return updatedBusiness.raw[0];
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
