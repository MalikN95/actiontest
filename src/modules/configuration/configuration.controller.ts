import {
  Controller,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Business } from 'modules/business/entity/business.entity';
import { BusinessObject } from 'modules/business/entity/business-object.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateConfigurationDto } from 'modules/configuration/dto/create-configuration.dto';
import { ConfigurationService } from './configuration.service';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { UpdateObjectDto } from './dto/update-object.dto';

@ApiTags('business-configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Business id',
  })
  @Patch(':id/update')
  updateBusinessConfiguration(
    @Body() updateConfigurationDto: UpdateConfigurationDto,
    @Param('id') id: number,
  ): Promise<void> {
    return this.configurationService.updateBusinessConfiguration(
      id,
      updateConfigurationDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-object')
  addBusinessObject(
    @Body()
    createConfigurationDto: CreateConfigurationDto,
  ): Promise<BusinessObject[]> {
    return this.configurationService.addBusinessObject(createConfigurationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Business Object id',
  })
  @Delete('delete-object/:id')
  deleteBusinessObject(@Param('id') id: number): Promise<DeleteResult> {
    return this.configurationService.deleteBusinessObject(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-objects')
  @ApiBody({ type: [UpdateObjectDto], required: true })
  updateBusinessObject(
    @Body() updateObjectDto: UpdateObjectDto[],
  ): Promise<void> {
    return this.configurationService.updateBusinessObject(updateObjectDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  @Post('update-logotype')
  @UseInterceptors(FileInterceptor('file'))
  updateLogotype(
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
  ): Promise<UpdateResult> {
    return this.configurationService.updateLogotype(file, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Business id',
  })
  @Post('update-background')
  @UseInterceptors(FileInterceptor('file'))
  updateBackground(
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
  ): Promise<UpdateResult> {
    return this.configurationService.updateBackground(file, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-background/:key')
  removeBackground(@Param('key') key: string): Promise<Business> {
    return this.configurationService.removeImage(key, 'background');
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-logotype/:key')
  removeLogotype(@Param('key') key: string): Promise<Business> {
    return this.configurationService.removeImage(key, 'logotype');
  }
}
