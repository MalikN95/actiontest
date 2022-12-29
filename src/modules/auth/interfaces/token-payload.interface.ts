import { RoleEnum } from 'modules/user/enums/role.enum';

export interface TokenPayload {
  id: number;
  email: string;
  name: string;
  adminRole: RoleEnum;
  activeBookingCount: number;
}
