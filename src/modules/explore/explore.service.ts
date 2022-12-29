import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'modules/files/files.service';
import { DeleteResult, Repository } from 'typeorm';
import { ExploreDto } from './dto/explore.dto';
import { Explore } from './entity/explore.entity';

@Injectable()
export class ExploreService {
  constructor(
    @InjectRepository(Explore)
    private readonly exploreRepository: Repository<Explore>,
    private readonly fileService: FilesService,
  ) {}

  async findBusinessExplorers(businessId: number): Promise<Explore[]> {
    try {
      const explorers = await this.exploreRepository
        .createQueryBuilder('explore')
        .leftJoinAndSelect('explore.business', 'business')
        .where('business.id = :businessId', { businessId })
        .getMany();

      return explorers;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async findImageByKey(imageKey: string): Promise<Explore> {
    try {
      const explore = await this.exploreRepository
        .createQueryBuilder('explore')
        .where('explore.imageUrl = :imageKey', { imageKey })
        .getOne();

      return explore;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addImage(file: Express.Multer.File): Promise<{ fileUrl: string }> {
    try {
      const upload = await this.fileService.uploadFile(file, 'explore');
      return { fileUrl: upload.key };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeImage(key: string): Promise<Explore> {
    try {
      await this.fileService.deleteFile(key);

      const explore = await this.findImageByKey(key);

      if (!explore) throw new NotFoundException();

      const updatedExplore = await this.exploreRepository
        .createQueryBuilder()
        .update(Explore)
        .set({
          ...explore,
          imageUrl: null,
        })
        .where('id = :id', { id: explore.id })
        .execute();

      return updatedExplore.raw[0];
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addExplore(exploreDto: {
    businessExplorers: ExploreDto[];
  }): Promise<Explore[]> {
    try {
      const addedExplorers = await this.exploreRepository.save([
        ...exploreDto.businessExplorers,
      ]);

      return addedExplorers;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteExplore(id: number): Promise<DeleteResult> {
    try {
      const explore = await this.exploreRepository.findOneBy({ id });

      if (explore.imageUrl) {
        await this.fileService.deleteFile(explore.imageUrl);
      }
      return this.exploreRepository.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
