import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { AssignRoleDto } from 'modules/user-business-role/dto/assign-role.dto';
import { UserBusiness } from 'modules/user-business-role/entities/user-businesses-business.entity';
import { UserBusinessRoleService } from 'modules/user-business-role/user-business-role.service';

@ApiTags('user-business-role')
@Controller('user-business-role')
export class UserBusinessRoleController {
  constructor(
    private readonly userBusinessRoleService: UserBusinessRoleService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('business-admins/:businessId')
  findBusinessAdmins(@Param('businessId') businessId: number) {
    return this.userBusinessRoleService.findBusinessAdmins(businessId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('assign-role')
  assignRole(@Body() assignRoleDto: AssignRoleDto): Promise<UserBusiness> {
    return this.userBusinessRoleService.assignRole(assignRoleDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-user/:id')
  removeUser(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<UserBusiness> {
    return this.userBusinessRoleService.removeUserFromBusiness(req, id);
  }
}
