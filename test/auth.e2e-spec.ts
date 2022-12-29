import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterDto } from '../src/modules/auth/dto/register.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { InvalidDto, mockUser } from './utils/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEnum } from '../src/modules/user/enums/role.enum';
import { ILoginRes } from '../src/modules/auth/interfaces/login-res.interface';

describe('AuthController e2e test', () => {
  let app: INestApplication;
  const REGISTER_USER_URL = '/api/auth/register';
  const LOGIN_USER_URL = '/api/auth/login';
  const LOGIN_ADMIN_URL = '/api/auth/login-admin';
  let repository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_TEST_HOST,
          port: +process.env.POSTGRES_TEST_PORT,
          username: process.env.POSTGRES_TEST_USERNAME,
          password: process.env.POSTGRES_TEST_PASSWORD,
          database: process.env.POSTGRES_TEST_DATABASE,
          entities: ['src/**/*.entity{.js,.ts}'],
          synchronize: false,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    repository = moduleFixture.get('UserRepository');
    await app.init();
  });

  it('should register user', function () {
    const user = {
      name: 'arthur_test123',
      ...mockUser,
    };

    const registerResult = {
      name: expect.any(String),
      email: expect.any(String),
      passwordResetToken: null,
      id: expect.any(Number),
      role: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    return request(app.getHttpServer())
      .post(REGISTER_USER_URL)
      .send(user)
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body).toMatchObject(registerResult);
      });
  });

  it('should fail on invalid DTO', async () => {
    const errorsEmail = await InvalidDto(
      {
        name: 'correct_name',
        email: 'uncorrect_email',
        password: 'correct_password',
      },
      RegisterDto,
    );
    expect(errorsEmail.length).not.toBe(0);
    expect(errorsEmail[0].constraints.isEmail).toContain(
      `email must be an email`,
    );

    const errorsName = await InvalidDto(
      {
        name: 123123213,
        email: 'uncorrect_email@gmail.com',
        password: 'correct_password',
      },
      RegisterDto,
    );
    expect(errorsName.length).not.toBe(0);
    expect(errorsName[0].constraints.isString).toContain(
      `name must be a string`,
    );

    const errorsPassword = await InvalidDto(
      {
        name: 'correct_name',
        email: 'uncorrect_email@gmail.com',
        password: 123123,
      },
      RegisterDto,
    );
    expect(errorsPassword.length).not.toBe(0);
    expect(errorsPassword[0].constraints.isString).toContain(
      `password must be a string`,
    );
  });

  it('should login user', function () {
    const loginResult: ILoginRes = {
      tokenPayload: {
        id: expect.any(Number),
        email: mockUser.email,
        name: expect.any(String),
        role: RoleEnum.GUEST,
        activeBookingCount: expect.any(Number),
      },
      accessToken: expect.any(String),
    };

    return request(app.getHttpServer())
      .post(LOGIN_USER_URL)
      .send(mockUser)
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body).toMatchObject(loginResult);
      });
  });

  it('should not login admin via role of user', function () {
    return request(app.getHttpServer())
      .post(LOGIN_ADMIN_URL)
      .send(mockUser)
      .expect(500)
      .expect((response: request.Response) => {
        expect(JSON.parse(response.text).status).toBe(401);
      });
  });

  it('should login admin ', async function () {
    // change role to pass login flow
    await repository.query(
      `UPDATE public."user" SET role='${RoleEnum.APP_OPERATOR}' WHERE email='${mockUser.email}';`,
    );

    const loginResult: ILoginRes = {
      tokenPayload: {
        id: expect.any(Number),
        email: mockUser.email,
        name: expect.any(String),
        role: RoleEnum.APP_OPERATOR,
        activeBookingCount: expect.any(Number),
      },
      accessToken: expect.any(String),
    };

    return request(app.getHttpServer())
      .post(LOGIN_ADMIN_URL)
      .send(mockUser)
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body).toMatchObject(loginResult);
      });
  });

  afterAll(async () => {
    await repository.query(
      `DELETE FROM public."user" WHERE email='${mockUser.email}';`,
    );
    await app.close();
  });
});
