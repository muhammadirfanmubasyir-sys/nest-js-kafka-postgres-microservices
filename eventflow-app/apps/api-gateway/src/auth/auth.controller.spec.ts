import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    service = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('should call authService.register with the dto', async () => {
      const dto = { email: 'test@test.com', password: 'secret123', name: 'Test' };
      const expected = { message: 'User registered successfully..', userId: '123' };
      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(result).toEqual(expected);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login()', () => {
    it('should call authService.login with the dto', async () => {
      const dto = { email: 'test@test.com', password: 'secret123' };
      const expected = { access_token: 'token', user: { id: '123' } };
      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      expect(result).toEqual(expected);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('getProfile()', () => {
    it('should call authService.getProfile with the Authorization header', async () => {
      const bearerAndToken = 'Bearer some-token';
      const expected = { id: '123', email: 'test@test.com', name: 'Test', role: 'USER' };
      mockAuthService.getProfile.mockResolvedValue(expected);

      const result = await controller.getProfile(bearerAndToken);

      expect(result).toEqual(expected);
      expect(mockAuthService.getProfile).toHaveBeenCalledWith(bearerAndToken);
    });
  });
});
