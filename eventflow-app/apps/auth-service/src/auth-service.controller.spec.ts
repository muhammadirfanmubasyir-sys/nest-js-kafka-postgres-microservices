import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
 
 
import { beforeEach, describe, it } from 'node:test';
import { expect, jest, test } from '@jest/globals';

describe('AuthServiceController', () => {
  let authServiceController: AuthServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthServiceController],
      providers: [AuthServiceService],
    }).compile();

    authServiceController = app.get<AuthServiceController>(AuthServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authServiceController.getHello()).toBe('Hello World!');
    });
  });
});
