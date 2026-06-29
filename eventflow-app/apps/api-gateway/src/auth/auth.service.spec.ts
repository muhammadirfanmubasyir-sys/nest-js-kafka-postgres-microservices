import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let httpService: HttpService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    httpService = app.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register()', () => {
    it('should return response data on success', async () => {
      const dto = { email: 'test@test.com', password: 'secret123', name: 'Test' };
      const responseData = { message: 'User registered successfully..', userId: '123' };
      mockHttpService.post.mockReturnValue(of({ data: responseData }));

      const result = await authService.register(dto);

      expect(result).toEqual(responseData);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        `${authService.authServiceUrl}/register`,
        dto,
      );
    });

    it('should throw HttpException when upstream returns error response', async () => {
      const dto = { email: 'test@test.com', password: 'secret123', name: 'Test' };
      const error = {
        response: { status: 409, data: { message: 'User already existed' } },
      };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(authService.register(dto)).rejects.toThrow(HttpException);
    });

    it('should throw 503 when no response from upstream', async () => {
      const dto = { email: 'test@test.com', password: 'secret123', name: 'Test' };
      const error = { message: 'Connection refused' };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(authService.register(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('login()', () => {
    it('should return response data on success', async () => {
      const dto = { email: 'test@test.com', password: 'secret123' };
      const responseData = { access_token: 'token', user: { id: '123' } };
      mockHttpService.post.mockReturnValue(of({ data: responseData }));

      const result = await authService.login(dto);

      expect(result).toEqual(responseData);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        `${authService.authServiceUrl}/login`,
        dto,
      );
    });

    it('should throw HttpException when upstream returns error response', async () => {
      const dto = { email: 'test@test.com', password: 'wrong' };
      const error = {
        response: { status: 401, data: { message: 'Invalid Credentials' } },
      };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(authService.login(dto)).rejects.toThrow(HttpException);
    });

    it('should throw 503 when no response from upstream', async () => {
      const dto = { email: 'test@test.com', password: 'secret123' };
      const error = { message: 'Connection refused' };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      await expect(authService.login(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('getProfile()', () => {
    it('should return response data on success', async () => {
      const bearerAndToken = 'Bearer some-token';
      const responseData = { id: '123', email: 'test@test.com', name: 'Test', role: 'USER' };
      mockHttpService.get.mockReturnValue(of({ data: responseData }));

      const result = await authService.getProfile(bearerAndToken);

      expect(result).toEqual(responseData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `${authService.authServiceUrl}/profile`,
        { headers: { Authorization: bearerAndToken } },
      );
    });

    it('should throw HttpException when upstream returns error response', async () => {
      const bearerAndToken = 'Bearer bad-token';
      const error = {
        response: { status: 401, data: { message: 'Unauthorized' } },
      };
      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(authService.getProfile(bearerAndToken)).rejects.toThrow(HttpException);
    });

    it('should throw 503 when no response from upstream', async () => {
      const bearerAndToken = 'Bearer some-token';
      const error = { message: 'ECONNREFUSED' };
      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(authService.getProfile(bearerAndToken)).rejects.toThrow(HttpException);
    });
  });

  describe('handleError()', () => {
    it('should throw HttpException with upstream status and message', async () => {
      const dto = { email: 'test@test.com', password: 'secret123', name: 'Test' };
      const error = {
        response: { status: 409, data: { message: 'Conflict occurred' } },
      };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      try {
        await authService.register(dto);
        fail('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(409);
        expect(e.message).toBe('Conflict occurred');
      }
    });

    it('should throw HttpException with default message when response has no message', async () => {
      const dto = { email: 'test@test.com', password: 'secret123', name: 'Test' };
      const error = {
        response: { status: 500, data: {} },
      };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      try {
        await authService.register(dto);
        fail('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(500);
        expect(e.message).toBe('Error from auth service');
      }
    });

    it('should throw 503 with error message when no response object', async () => {
      const dto = { email: 'test@test.com', password: 'secret123', name: 'Test' };
      const error = { message: 'Network timeout' };
      mockHttpService.post.mockReturnValue(throwError(() => error));

      try {
        await authService.register(dto);
        fail('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(503);
        expect(e.message).toBe('Network timeout');
      }
    });

    it('should throw 503 with default message when no message at all', async () => {
      const dto = { email: 'test@test.com', password: 'secret123', name: 'Test' };
      mockHttpService.post.mockReturnValue(throwError(() => ({})));

      try {
        await authService.register(dto);
        fail('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.getStatus()).toBe(503);
        expect(e.message).toBe('Internal server error');
      }
    });
  });
});
