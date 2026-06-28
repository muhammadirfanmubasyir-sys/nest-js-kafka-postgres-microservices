import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
 
// Removed node:test completely
// import { beforeEach, describe, it, expect, jest } from '@jest/globals';

describe('AuthServiceController', () => {
  let controller: AuthServiceController;
  let service: AuthServiceService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthServiceController],
      providers: [
        {
          provide: AuthServiceService,
          useValue: {
            getHello: jest.fn(), 
            register: jest.fn(), 
          },
        }
      ],
    }).compile();

    controller = app.get<AuthServiceController>(AuthServiceController);
    service = app.get<AuthServiceService>(AuthServiceService);
  });

  it('getHello should return "Hello Irfan!"', () => {
    jest.spyOn(service, 'getHello').mockReturnValue('Hello Irfan!');
    expect(controller.getHello()).toBe('Hello Irfan!'); // Changed to controller to test the controller layer
  });

  it('register should call authServiceService.register with correct parameters', () => {
    const expectedResponse = {
      message: 'User registered successfully',
      userId: 'irfan123',
    };

    jest.spyOn(service, 'register').mockImplementation(() => expectedResponse as any);

    const dto = { email: 'test@example.com', password: 'password', name: 'Test User' };
    const response = controller.register(dto);

    expect(service.register).toHaveBeenCalledWith(dto.email, dto.password, dto.name);
    expect(response).toEqual(expectedResponse);
  });  
});
