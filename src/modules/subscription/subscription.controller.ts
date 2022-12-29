import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { CreateSubscriptionDto } from 'modules/subscription/dto/create-subscription.dto';
import { UpdateSubscriptionDto } from 'modules/subscription/dto/update-subscription.dto';
import { Subscription } from 'modules/subscription/entity/subscription.entity';
import { SubscriptionService } from 'modules/subscription/subscription.service';
import { RoleEnum } from 'modules/user/enums/role.enum';
import { RoleGuard } from 'modules/user/guards/role.guard';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(RoleGuard([RoleEnum.APP_OPERATOR, RoleEnum.SUPER_ADMIN]))
  @Patch(':businessId')
  updateSubscription(
    @Param('businessId') businessId: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.updateSubscription(
      businessId,
      updateSubscriptionDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  newSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Req() req: AuthRequest,
  ): Promise<Subscription> {
    return this.subscriptionService.newSubscription(createSubscriptionDto, req);
  }
}
