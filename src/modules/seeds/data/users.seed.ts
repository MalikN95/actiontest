import { RoleEnum } from 'modules/user/enums/role.enum';

interface User {
  name: string;
  email: string;
  password: string;
}

const user1 = {
  name: 'Super Admin',
  email: 'super-admin@mail.wehost',
  password: 'Abc12345',
  adminRole: RoleEnum.SUPER_ADMIN,
};

const user2 = {
  name: 'User',
  email: 'user@mail.wehost',
  password: 'Abc12345',
};

const user3 = {
  name: 'App Operator',
  email: 'app-operator@mail.wehost',
  password: 'Abc12345',
  adminRole: RoleEnum.APP_OPERATOR,
};

export const usersSeed: User[] = [user1, user2, user3];
