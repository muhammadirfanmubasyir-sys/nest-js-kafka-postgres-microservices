import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthServiceController, JwtAuthGuard } from '../src/auth-service.controller';
import { AuthServiceService } from '../src/auth-service.service';
import { JwtStrategy } from '../src/jwt.strategy';
import { KAFKA_SERVICE } from '@app/kafka';

import request from 'supertest';

describe('AuthServiceController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const mockKafkaClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    emit: jest.fn(),
  };

  const mockAuthServiceService = {
    getHello: jest.fn().mockReturnValue('Auth Service is running on port 3001'),
    register: jest.fn().mockResolvedValue({ message: 'User registered successfully..', userId: '123' }),
    login: jest.fn().mockResolvedValue({
      access_token: 'valid-token',
      user: { id: '123', email: 'test@test.com', name: 'Test User', role: 'USER' },
    }),
    getProfile: jest.fn().mockResolvedValue({ id: '123', email: 'test@test.com', name: 'Test User', role: 'USER' }),
    handleUserRegisteredEvent: jest.fn(),
    handleUserLoginMessage: jest.fn(),
  };

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: KAFKA_SERVICE,
            transport: Transport.KAFKA,
            options: {
              client: { brokers: ['localhost:9092'] },
              consumer: { groupId: 'test-consumer' },
            },
          },
        ]),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [AuthServiceController],
      providers: [
        { provide: AuthServiceService, useValue: mockAuthServiceService },
        JwtStrategy,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    jwtService = moduleFixture.get(JwtService);

    const clientRef = moduleFixture.get(KAFKA_SERVICE);
    Object.assign(clientRef, mockKafkaClient);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthServiceService.getHello.mockReturnValue('Auth Service is running on port 3001');
    mockAuthServiceService.register.mockResolvedValue({ message: 'User registered successfully..', userId: '123' });
    mockAuthServiceService.login.mockResolvedValue({
      access_token: 'valid-token',
      user: { id: '123', email: 'test@test.com', name: 'Test User', role: 'USER' },
    });
    mockAuthServiceService.getProfile.mockResolvedValue({ id: '123', email: 'test@test.com', name: 'Test User', role: 'USER' });
    mockKafkaClient.connect.mockResolvedValue(undefined);
    mockKafkaClient.emit.mockResolvedValue(undefined);
  });

  // ─── GET / ───────────────────────────────────────────────

  describe('GET /', () => {
    it('should return service status', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Auth Service is running on port 3001');
    });
  });

  // ─── POST /register ─────────────────────────────────────

  describe('POST /register', () => {
    const validDto = { email: 'new@test.com', password: 'secret123', name: 'New User' };

    it('should register a new user and return 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/register')
        .send(validDto)
        .expect(201);

      expect(res.body).toEqual({ message: 'User registered successfully..', userId: '123' });
      expect(mockAuthServiceService.register).toHaveBeenCalledWith(validDto.email, validDto.password, validDto.name);
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ password: 'secret123', name: 'Test' })
        .expect(400);
    });

    it('should return 400 when email is invalid', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ email: 'not-an-email', password: 'secret123', name: 'Test' })
        .expect(400);
    });

    it('should return 400 when password is shorter than 6 characters', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ email: 'test@test.com', password: '123', name: 'Test' })
        .expect(400);
    });

    it('should return 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ email: 'test@test.com', password: 'secret123' })
        .expect(400);
    });

    it('should return 409 when user already exists', async () => {
      mockAuthServiceService.register.mockRejectedValue(new ConflictException('User already existed'));

      const res = await request(app.getHttpServer())
        .post('/register')
        .send(validDto)
        .expect(409);

      expect(res.body.message).toBe('User already existed');
    });
  });

  // ─── POST /login ────────────────────────────────────────

  describe('POST /login', () => {
    const validDto = { email: 'test@test.com', password: 'secret123' };

    it('should return access_token and user on success', async () => {
      const res = await request(app.getHttpServer())
        .post('/login')
        .send(validDto)
        .expect(201);

      expect(res.body.access_token).toBe('valid-token');
      expect(res.body.user).toEqual({ id: '123', email: 'test@test.com', name: 'Test User', role: 'USER' });
      expect(mockAuthServiceService.login).toHaveBeenCalledWith(validDto.email, validDto.password);
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ password: 'secret123' })
        .expect(400);
    });

    it('should return 400 when email is invalid', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ email: 'bad', password: 'secret123' })
        .expect(400);
    });

    it('should return 400 when password is shorter than 6 characters', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ email: 'test@test.com', password: '123' })
        .expect(400);
    });

    it('should return 401 when credentials are invalid', async () => {
      mockAuthServiceService.login.mockRejectedValue(new UnauthorizedException('Invalid Credentials'));

      const res = await request(app.getHttpServer())
        .post('/login')
        .send(validDto)
        .expect(401);

      expect(res.body.message).toBe('Invalid Credentials');
    });
  });

  // ─── GET /profile ───────────────────────────────────────

  describe('GET /profile', () => {
    function generateToken(sub: string, email: string): string {
      return jwtService.sign({ sub, email });
    }

    it('should return user profile with valid JWT', async () => {
      const token = generateToken('123', 'test@test.com');

      const res = await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual({ id: '123', email: 'test@test.com', name: 'Test User', role: 'USER' });
      expect(mockAuthServiceService.getProfile).toHaveBeenCalledWith('123');
    });

    it('should return 401 when no token is provided', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .expect(401);
    });

    it('should return 401 when token is invalid', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 401 when token is expired', async () => {
      const expiredToken = jwtService.sign(
        { sub: '123', email: 'test@test.com' },
        { expiresIn: '0s' },
      );

      // Small delay to ensure the token is expired
      await new Promise((resolve) => setTimeout(resolve, 100));

      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('should return 401 when Authorization header has wrong scheme', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'Basic dXNlcjpwYXNz')
        .expect(401);
    });
  });
});
