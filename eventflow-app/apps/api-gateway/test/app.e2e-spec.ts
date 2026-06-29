import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Root endpoints ────────────────────────────────────

  it('GET / should return service status', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('API Gateway is running on port 3000');
  });

  it('GET /hello should return Hello World!', () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Hello World!');
  });

  // ─── POST /auth/register ───────────────────────────────

  describe('POST /auth/register', () => {
    it('should return 201 on success', async () => {
      const responseData = { message: 'User registered successfully..', userId: '123' };
      mockHttpService.post.mockReturnValue(of({ data: responseData }));

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'secret123', name: 'Test' })
        .expect(201);

      expect(res.body).toEqual(responseData);
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ password: 'secret123', name: 'Test' })
        .expect(400);
    });

    it('should return 400 when email is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'bad', password: 'secret123', name: 'Test' })
        .expect(400);
    });

    it('should return 400 when password is shorter than 6 characters', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@test.com', password: '123', name: 'Test' })
        .expect(400);
    });

    it('should return 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'secret123' })
        .expect(400);
    });

    it('should forward upstream 409 conflict', async () => {
      mockHttpService.post.mockReturnValue(
        throwError(() => ({
          response: { status: 409, data: { message: 'User already existed' } },
        })),
      );

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'secret123', name: 'Test' })
        .expect(409);

      expect(res.body.message).toBe('User already existed');
    });

    it('should return 503 when auth service is down', async () => {
      mockHttpService.post.mockReturnValue(
        throwError(() => ({ message: 'ECONNREFUSED' })),
      );

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'secret123', name: 'Test' })
        .expect(503);

      expect(res.body.message).toBe('ECONNREFUSED');
    });
  });

  // ─── POST /auth/login ──────────────────────────────────

  describe('POST /auth/login', () => {
    it('should return 201 on success', async () => {
      const responseData = { access_token: 'token', user: { id: '123' } };
      mockHttpService.post.mockReturnValue(of({ data: responseData }));

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'secret123' })
        .expect(201);

      expect(res.body).toEqual(responseData);
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'secret123' })
        .expect(400);
    });

    it('should return 400 when email is invalid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'bad', password: 'secret123' })
        .expect(400);
    });

    it('should return 400 when password is shorter than 6 characters', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.com', password: '123' })
        .expect(400);
    });

    it('should forward upstream 401 unauthorized', async () => {
      mockHttpService.post.mockReturnValue(
        throwError(() => ({
          response: { status: 401, data: { message: 'Invalid Credentials' } },
        })),
      );

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'secret123' })
        .expect(401);

      expect(res.body.message).toBe('Invalid Credentials');
    });

    it('should return 503 when auth service is down', async () => {
      mockHttpService.post.mockReturnValue(
        throwError(() => ({ message: 'ECONNREFUSED' })),
      );

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'secret123' })
        .expect(503);

      expect(res.body.message).toBe('ECONNREFUSED');
    });
  });

  // ─── GET /auth/profile ─────────────────────────────────

  describe('GET /auth/profile', () => {
    it('should return 200 with user profile', async () => {
      const responseData = { id: '123', email: 'test@test.com', name: 'Test', role: 'USER' };
      mockHttpService.get.mockReturnValue(of({ data: responseData }));

      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer some-token')
        .expect(200);

      expect(res.body).toEqual(responseData);
    });

    it('should forward upstream 401 when token is invalid', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => ({
          response: { status: 401, data: { message: 'Unauthorized' } },
        })),
      );

      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer bad-token')
        .expect(401);

      expect(res.body.message).toBe('Unauthorized');
    });

    it('should return 503 when auth service is down', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => ({ message: 'ECONNREFUSED' })),
      );

      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer some-token')
        .expect(503);

      expect(res.body.message).toBe('ECONNREFUSED');
    });
  });
});
