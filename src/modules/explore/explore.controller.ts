import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ExploreDto } from 'modules/explore/dto/explore.dto';
import { Explore } from 'modules/explore/entity/explore.entity';
import { ExploreService } from 'modules/explore/explore.service';
import { DeleteResult } from 'typeorm';

@ApiTags('explore')
@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':businessId')
  findByBusiness(@Param('businessId') businessId: number): Promise<Explore[]> {
    return this.exploreService.findBusinessExplorers(businessId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-image')
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ fileUrl: string }> {
    return this.exploreService.addImage(file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-image/:key')
  removeImage(@Param('key') key: string): Promise<Explore> {
    return this.exploreService.removeImage(key);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  addExplore(
    @Body() exploreDto: { businessExplorers: ExploreDto[] },
  ): Promise<Explore[]> {
    return this.exploreService.addExplore(exploreDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({
    name: 'id',
    required: true,
    type: Number,
    description: 'Explore id',
  })
  @Delete('delete')
  @UseInterceptors(FileInterceptor('img'))
  deleteExplore(@Query('id') id: number): Promise<DeleteResult> {
    return this.exploreService.deleteExplore(id);
  }
}
