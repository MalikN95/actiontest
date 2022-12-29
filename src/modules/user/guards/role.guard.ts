import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  mixin,
  Type,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'modules/auth/interfaces/auth-request.interface';
import { RoleEnum } from 'modules/user/enums/role.enum';

export const RoleGuard = (roles: RoleEnum[]): Type<CanActivate> => {
  class RoleGuardMixin extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext) {
      try {
        await super.canActivate(context);

        const request = context.switchToHttp().getRequest<AuthRequest>();
        const { user } = request;

        return roles.includes(user.adminRole);
      } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  return mixin(RoleGuardMixin);
};
