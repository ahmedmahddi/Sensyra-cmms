import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('WorkOrdersController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Create a user and get token
    const registerRes = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        user: {
          email: `wo-test-${Date.now()}@example.com`,
          password: 'password123',
          firstName: 'WO',
          lastName: 'Test',
        },
        organization: {
          name: 'WO Test Org',
          slug: `wo-test-${Date.now()}`,
        },
      });

    accessToken = registerRes.body.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/work-orders (POST)', () => {
    it('should create a work order', () => {
      return request(app.getHttpServer())
        .post('/v1/work-orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Fix HVAC System',
          description: 'The AC is not cooling properly',
          priority: 'HIGH',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toEqual('Fix HVAC System');
          expect(res.body).toHaveProperty('number');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/v1/work-orders')
        .send({
          title: 'This should fail',
          priority: 'LOW',
        })
        .expect(401);
    });
  });

  describe('/work-orders (GET)', () => {
    it('should list work orders', () => {
      return request(app.getHttpServer())
        .get('/v1/work-orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/work-orders/:id (GET)', () => {
    it('should get a single work order', async () => {
      // Create one first
      const createRes = await request(app.getHttpServer())
        .post('/v1/work-orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Get Test WO',
          priority: 'MEDIUM',
        });

      const workOrderId = createRes.body.id;

      return request(app.getHttpServer())
        .get(`/v1/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(workOrderId);
        });
    });
  });

  describe('/work-orders/:id (PATCH)', () => {
    it('should update a work order', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/v1/work-orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Update Test WO',
          priority: 'LOW',
        });

      const workOrderId = createRes.body.id;

      return request(app.getHttpServer())
        .patch(`/v1/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated Title' })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toEqual('Updated Title');
        });
    });
  });

  describe('/work-orders/:id/status (PATCH)', () => {
    it('should change work order status', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/v1/work-orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Status Test WO',
          priority: 'MEDIUM',
        });

      const workOrderId = createRes.body.id;

      return request(app.getHttpServer())
        .patch(`/v1/work-orders/${workOrderId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'IN_PROGRESS' })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toEqual('IN_PROGRESS');
        });
    });
  });
});
