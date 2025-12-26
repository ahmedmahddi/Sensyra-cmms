import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    const registerDto = {
      user: {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      },
      organization: {
        name: 'Test Organization',
        slug: `test-org-${Date.now()}`,
      },
    };

    it('should register a new user and organization', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('tokens');
          expect(res.body.tokens).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toEqual(registerDto.user.email);
        });
    });

    it('should fail with duplicate email', async () => {
      // First create the user
      await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          user: {
            email: 'duplicate@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
          },
          organization: {
            name: 'Dup Org',
            slug: 'dup-org',
          },
        });

      // Try to register again with same email
      return request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          user: {
            email: 'duplicate@example.com',
            password: 'password123',
            firstName: 'Test2',
            lastName: 'User2',
          },
          organization: {
            name: 'Dup Org 2',
            slug: 'dup-org-2',
          },
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      const email = `login-test-${Date.now()}@example.com`;

      // Register first
      await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send({
          user: {
            email,
            password: 'password123',
            firstName: 'Login',
            lastName: 'Test',
          },
          organization: {
            name: 'Login Test Org',
            slug: `login-test-${Date.now()}`,
          },
        });

      // Then login
      return request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email, password: 'password123' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('tokens');
          expect(res.body.tokens).toHaveProperty('accessToken');
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrong' })
        .expect(401);
    });
  });
});
