import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const mockUser = {
  email: 'arthur_test.demenskiy_test1@gmail.com',
  password: '12345678',
};

export const InvalidDto = async (myBody, Dto) => {
  const myDtoObject = plainToInstance(Dto, myBody);
  return await validate(myDtoObject);
};
