import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { Chat } from 'modules/chat/entity/chat.entity';
import { OrderByDto } from 'modules/dto/order-by.dto';
import { PaginationDto } from 'modules/dto/pagination.dto';
import { RoleEnum } from 'modules/user/enums/role.enum';
import { RoleGuard } from 'modules/user/guards/role.guard';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { DeleteResult } from 'typeorm';
import { BusinessService } from './business.service';
import { SearchBusinessDto } from './dto/search-business.dto';
import { Business } from './entity/business.entity';
import { BusinessObject } from './entity/business-object.entity';

@ApiTags('business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @UseGuards(RoleGuard([RoleEnum.APP_OPERATOR, RoleEnum.SUPER_ADMIN]))
  @Get('all')
  getAllBusiness(
    @Query() searchBusinessDto: SearchBusinessDto,
    @Query() orderByDto: OrderByDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ business: UserBusiness[]; total: number }> {
    return this.businessService.getAllBusiness(
      searchBusinessDto,
      orderByDto,
      paginationDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/all')
  getAllUserBusiness(@Req() req: AuthRequest): Promise<Business[]> {
    return this.businessService.getAllUserBusiness(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Business id',
  })
  @Get(':id/configuration')
  getBusinessConfiguration(@Param('id') id: number): Promise<Business> {
    return this.businessService.getBusinessConfiguration(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Business id',
  })
  @Get(':id/subscription')
  getBusinessSubscription(@Param('id') id: number): Promise<Business> {
    return this.businessService.getBusinessSubscription(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Business id',
  })
  @Get(':id/information')
  getBusinessInformation(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<Business> {
    return this.businessService.getBusinessInformation(id, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Business id',
  })
  @Get(':id/explore')
  getBusinessExplore(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<Business> {
    return this.businessService.getBusinessExplore(id, req);
  }

  @UseGuards(RoleGuard([RoleEnum.APP_OPERATOR, RoleEnum.SUPER_ADMIN]))
  @Delete(':id')
  deleteSubscription(@Param('id') id: number): Promise<DeleteResult> {
    return this.businessService.deleteBusiness(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Business id',
  })
  @Get(':id/chat-setting')
  getBusinessChatSetting(@Param('id') id: number): Promise<Business> {
    return this.businessService.getBusinessChatSetting(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Business id',
  })
  @Get(':id/chat-list')
  getBusinessChatList(
    @Param('id') id: number,
  ): Promise<{ general: Chat[]; objectList: BusinessObject[] }> {
    return this.businessService.getBusinessChatList(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  searchBusiness(
    @Query() { pageSize, skipPages }: PaginationDto,
    @Query() searchBusinessDto: SearchBusinessDto,
  ): Promise<{ business: Business[]; count: number }> {
    return this.businessService.searchBusiness(
      pageSize,
      skipPages,
      searchBusinessDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('unread-message')
  unreadMessageBusiness(@Req() req: AuthRequest): Promise<Business[]> {
    return this.businessService.unreadMessageBusiness(req);
  }
}
