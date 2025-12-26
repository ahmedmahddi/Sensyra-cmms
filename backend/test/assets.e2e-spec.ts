import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AssetsController (e2e)', () => {
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
          email: `asset-test-${Date.now()}@example.com`,
          password: 'password123',
          firstName: 'Asset',
          lastName: 'Test',
        },
        organization: {
          name: 'Asset Test Org',
          slug: `asset-test-${Date.now()}`,
        },
      });

    accessToken = registerRes.body.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/assets (POST)', () => {
    it('should create an asset', () => {
      return request(app.getHttpServer())
        .post('/v1/assets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'CNC Machine',
          assetTag: `AST-${Date.now()}`,
          status: 'OPERATIONAL',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toEqual('CNC Machine');
        });
    });

    it('should fail with duplicate asset tag', async () => {
      const assetTag = `DUP-${Date.now()}`;

      await request(app.getHttpServer())
        .post('/v1/assets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'First Asset',
          assetTag,
          status: 'OPERATIONAL',
        });

      return request(app.getHttpServer())
        .post('/v1/assets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Second Asset',
          assetTag,
          status: 'OPERATIONAL',
        })
        .expect(409);
    });
  });

  describe('/assets (GET)', () => {
    it('should list assets', () => {
      return request(app.getHttpServer())
        .get('/v1/assets')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/assets/:id (GET)', () => {
    it('should get a single asset', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/v1/assets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Get Test Asset',
          assetTag: `GET-${Date.now()}`,
          status: 'OPERATIONAL',
        });

      const assetId = createRes.body.id;

      return request(app.getHttpServer())
        .get(`/v1/assets/${assetId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(assetId);
        });
    });

    it('should return 404 for non-existent asset', () => {
      return request(app.getHttpServer())
        .get('/v1/assets/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/assets/:id (PATCH)', () => {
    it('should update an asset', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/v1/assets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Update Test Asset',
          assetTag: `UPD-${Date.now()}`,
          status: 'OPERATIONAL',
        });

      const assetId = createRes.body.id;

      return request(app.getHttpServer())
        .patch(`/v1/assets/${assetId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Updated Asset Name' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toEqual('Updated Asset Name');
        });
    });
  });

  describe('/assets/:id (DELETE)', () => {
    it('should soft delete an asset', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/v1/assets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Delete Test Asset',
          assetTag: `DEL-${Date.now()}`,
          status: 'OPERATIONAL',
        });

      const assetId = createRes.body.id;

      return request(app.getHttpServer())
        .delete(`/v1/assets/${assetId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
