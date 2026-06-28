import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceService } from './auth-service.service';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { DatabaseService, users } from '@app/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthServiceService', () => {
    let service: AuthServiceService;
    let kafkaClient: jest.Mocked<ClientKafka>;
    let dbService: jest.Mocked<DatabaseService>;
    let jwtService: jest.Mocked<JwtService>;

    // Reusable chainable builder for Drizzle ORM mocking
    const mockDbBuilder = {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn(),
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn(),
    };

    beforeEach(async () => {
        const mockKafkaClient = {
        connect: jest.fn(),
        emit: jest.fn(),
        };

        const mockDatabaseService = {
        db: mockDbBuilder,
        };

        const mockJwtService = {
        sign: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
        providers: [
            AuthServiceService,
            { provide: KAFKA_SERVICE, useValue: mockKafkaClient },
            { provide: DatabaseService, useValue: mockDatabaseService },
            { provide: JwtService, useValue: mockJwtService },
        ],
        }).compile();

        service = module.get<AuthServiceService>(AuthServiceService);
        kafkaClient = module.get(KAFKA_SERVICE);
        dbService = module.get(DatabaseService);
        jwtService = module.get(JwtService);

        jest.clearAllMocks();
    });

    it('should connect to Kafka broker', async () => {
        await service.onModuleInit();
        expect(kafkaClient.connect).toHaveBeenCalledTimes(1);
    });
   
    it('should throw ConflictException if user already exists', async () => {
      mockDbBuilder.limit.mockResolvedValueOnce([{ id: '1', email: 'test@test.com' }]);

      await expect(
        service.register('test@test.com', 'password123', 'John Doe'),
      ).rejects.toThrow(ConflictException);
    });

    it('should register a new user and emit a Kafka event', async () => {
      mockDbBuilder.limit.mockResolvedValueOnce([]); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      mockDbBuilder.returning.mockResolvedValueOnce([{ id: 'user-123', email: 'test@test.com' }]);

      const result = await service.register('test@test.com', 'password123', 'John Doe');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockDbBuilder.insert).toHaveBeenCalledWith(users);
      expect(kafkaClient.emit).toHaveBeenCalledWith(
        KAFKA_TOPICS.USER_REGISTERED,
        expect.objectContaining({
          userId: 'user-123',
          email: 'test@test.com',
        }),
      );
      expect(result).toEqual({
        message: 'User registered successfully..',
        userId: 'user-123',
      });
    });
  
    it('should throw UnauthorizedException if user is not found', async () => {
      mockDbBuilder.limit.mockResolvedValueOnce([]); // No user found

      await expect(service.login('wrong@test.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockDbBuilder.limit.mockResolvedValueOnce([{ email: 'test@test.com', password: 'hashed' }]);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false); // Wrong password

      await expect(service.login('test@test.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return token and user details on successful login', async () => {
      const mockUser = { id: '1', email: 'test@test.com', password: 'hashed', name: 'John', role: 'user' };
      mockDbBuilder.limit.mockResolvedValueOnce([mockUser]);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      jwtService.sign.mockReturnValueOnce('mock-jwt-token');

      const result = await service.login('test@test.com', 'password123');

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: '1', email: 'test@test.com' });
      expect(kafkaClient.emit).toHaveBeenCalledWith(
        KAFKA_TOPICS.USER_LOGIN,
        expect.objectContaining({
          userId: '1',
          userEmail: 'test@test.com',
        }),
      );
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: { id: '1', email: 'test@test.com', name: 'John', role: 'user' },
      });
    });
 
    it('should return user record if found', async () => {
      const expectedProfile = { id: '1', email: 'test@test.com', name: 'John', role: 'user' };
      mockDbBuilder.limit.mockResolvedValueOnce([expectedProfile]);

      const result = await service.getProfile('1');

      expect(result).toEqual(expectedProfile);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockDbBuilder.limit.mockResolvedValueOnce([]);

      await expect(service.getProfile('non-existent')).rejects.toThrow(UnauthorizedException);
    });
 
    it('should successfully parse and execute handleUserRegisteredEvent', () => {
      const spyLogger = jest.spyOn(service.LOGGER, 'log').mockImplementation();
      const mockPayload = { value: JSON.stringify({ userId: '1', email: 't@t.com', timestamp: 'now' }) };
      
      service.handleUserRegisteredEvent(mockPayload);
      
      expect(spyLogger).toHaveBeenCalled();
      spyLogger.mockRestore();
    });

    it('should successfully parse and execute handleUserLoginMessage', () => {
      const spyLogger = jest.spyOn(service.LOGGER, 'log').mockImplementation();
      const mockPayload = { value: { userId: '1', userEmail: 't@t.com', timestamp: 'now' } };
      
      service.handleUserLoginMessage(mockPayload);
      
      expect(spyLogger).toHaveBeenCalled();
      spyLogger.mockRestore();
    });

    it('should return configuration port string from getHello', () => {
      expect(service.getHello()).toContain('Auth Service is running on port');
    });

  

});
