import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Business } from 'modules/business/entity/business.entity';
import { Gallery } from 'modules/business/entity/gallery.entity';
import { CreateInformationDto } from 'modules/information/dto/create-information.dto';
import { UpdateInformationDto } from 'modules/information/dto/update-information.dto';
import { InformationService } from 'modules/information/information.service';

@ApiTags('information')
@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add-info')
  addInformation(
    @Body() informationDto: CreateInformationDto,
  ): Promise<Business> {
    return this.informationService.addInformation(informationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/update')
  updateInformation(
    @Param('id') businessId: number,
    @Body() informationDto: UpdateInformationDto,
  ): Promise<Business> {
    return this.informationService.updateInformation(
      businessId,
      informationDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-about-image')
  @UseInterceptors(FileInterceptor('file'))
  addAboutImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ fileUrl: string }> {
    return this.informationService.addAboutImage(file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-about-image/:key')
  removeAboutImage(@Param('key') key: string): Promise<Business> {
    return this.informationService.removeAboutImage(key);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  @Post('upload-gallery')
  @UseInterceptors(FileInterceptor('img'))
  uploadGallery(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|webp|png/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Query('id') id: number,
  ): Promise<Gallery> {
    return this.informationService.uploadGallery(file, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'image id',
  })
  @Delete('delete-gallery-img')
  deleteGalleryImg(@Query('id') id: number): Promise<void> {
    return this.informationService.deleteGalleryImg(id);
  }
}
