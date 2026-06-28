import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController, JwtAuthGuard  } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { ExecutionContext } from '@nestjs/common';
 
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
            login: jest.fn(),
            handleUserRegisteredEvent: jest.fn(),
            handleUserLoginMessage: jest.fn(),
            getProfile: jest.fn(),
          }, // Use the full service spy object
        }
      ],
    })
 
    .compile();

    controller = app.get<AuthServiceController>(AuthServiceController);
    service = app.get<AuthServiceService>(AuthServiceService);
  });

  it('getHello(): should call service.getHello and return result', () => {
    const expectedResponse = 'Hello Irfan!';
    jest.spyOn(service, 'getHello').mockImplementation(() => expectedResponse as any);
    expect(controller.getHello()).toBe('Hello Irfan!'); // Changed to controller to test the controller layer
  });

  
  it('register(): should pass individual dto properties to service.register', () => {
    const expectedResponse = {
      message: 'User registered successfully',
      userId: 'irfan123',
    };
   
    jest.spyOn(service, 'register').mockImplementation(() => expectedResponse as any);
    //mockAuthService.register.mockResolvedValue(expectedResponse);
    const dto = { email: 'test@example.com', password: 'password', name: 'Test User' };
 
    expect(controller.register(dto)).toEqual(expectedResponse);
    expect(service.register).toHaveBeenCalledWith(dto.email, dto.password, dto.name);
  });  


  it('login(): should forward credentials to service.login', () => {
    const expectedResponse = {
      access_token: "token",
      user: {
        id: "irfan123",
        email: "irfan@gmail.com",
        name: "irfan",
        role: "user",
      }
    };

    jest.spyOn(service, 'login').mockImplementation(() => expectedResponse as any);
    //mockAuthService.login.mockResolvedValue(expectedResponse);
    const dto = { email: 'test@example.com', password: 'password' }; 

    expect(controller.login(dto)).toEqual(expectedResponse);
    expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
    
  });  


  it('handleUserRegistered(): should call service.handleUserRegisteredEvent with the message', () => {
    const message = { userId: '123', email: 'test@example.com', timestamp: new Date() };
    controller.handleUserRegistered(message);
    expect(service.handleUserRegisteredEvent).toHaveBeenCalledWith(message);
  });

  it('handleUserLogin(): should call service.handleUserLoginMessage with the message', () => {
    const message = { userId: '123', email: 'test@example.com', timestamp: new Date() };
    controller.handleUserLogin(message);
    expect(service.handleUserLoginMessage).toHaveBeenCalledWith(message);
  });

  /*
  it('getProfile(): should call service.getProfile with the userId from request', async () => { 
    const userId = '123'; 
    const req = { user: { userId } }; 
    const expectedProfile = { id: userId, email: 'test@example.com', name: 'Test User', role: 'USER' };

    jest.spyOn(service, 'getProfile').mockImplementation( expectedProfile as any);
    //mockAuthService.getProfile.mockResolvedValue(expectedProfile);
    const result =  controller.getProfile(req);

  //  expect(result).toEqual(expectedProfile);
    expect(service.getProfile).toHaveBeenCalledWith(req);
  });
  */

});
