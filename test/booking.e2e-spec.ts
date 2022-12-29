import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Bookings controller e2e test', () => {
  let app: INestApplication;
  let JWT_TOKEN: string;
  const REGISTER_USER_URL = '/api/auth/register';
  const LOGIN_USER_URL = '/api/auth/login';
  const BOOKINGS_GET_ALL_URL = '/api/bookings';
  const BOOKINGS_GET_SEARCH_URL = '/api/bookings/search';
  let repository;
  let newUserForJwtToken;
  const yourTestDBParams = {
    businessId: 27,
    searchValue: 'User',
  };

  const bookResult = {
    id: expect.any(Number),
    checkIn: expect.any(String),
    checkOut: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    user: {
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      role: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      passwordResetToken: null,
    },
    businessObject: {
      id: expect.any(Number),
      objectName: expect.any(String),
      location: expect.any(String),
      wifiName: expect.any(String),
      wifiPassword: expect.any(String),
    },
  };

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

    newUserForJwtToken = {
      email: 'artur.test_books@gmail.com',
      password: '12345678',
    };

    await request(app.getHttpServer())
      .post(REGISTER_USER_URL)
      .send({
        name: 'artur_test_books',
        ...newUserForJwtToken,
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post(LOGIN_USER_URL)
      .send(newUserForJwtToken)
      .expect(201);

    JWT_TOKEN = loginResponse.body.accessToken;
  });

  it('should retrun bookings all', async () => {
    return request(app.getHttpServer())
      .get(BOOKINGS_GET_ALL_URL)
      .set({
        Authorization: `Bearer ${JWT_TOKEN}`,
        Accept: 'application/json',
      })
      .query({ id: yourTestDBParams.businessId, skipPages: 0, pageSize: 10 })
      .expect(200)
      .expect((response: request.Response) => {
        expect(response.body).toMatchObject([bookResult]);
      });
  });

  it('should retrun search bookings result', async () => {
    const searchBookResult = {
      bookings: [bookResult],
      total: expect.any(Number),
    };

    return request(app.getHttpServer())
      .get(BOOKINGS_GET_SEARCH_URL)
      .set({
        Authorization: `Bearer ${JWT_TOKEN}`,
        Accept: 'application/json',
      })
      .query({
        id: yourTestDBParams.businessId,
        searchValue: yourTestDBParams.searchValue,
        skipPages: 0,
        pageSize: 10,
      })
      .expect(200)
      .expect((response: request.Response) => {
        expect(response.body).toMatchObject(searchBookResult);
      });
  });

  afterAll(async () => {
    await repository.query(
      `DELETE FROM public."user" WHERE email='${newUserForJwtToken.email}';`,
    );
    await app.close();
  });
});
