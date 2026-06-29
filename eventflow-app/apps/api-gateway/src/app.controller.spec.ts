import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  it('getInfo(): should return gateway status with port', () => {
    expect(controller.getInfo()).toBe('API Gateway is running on port 3000');
  });

  it('getHello(): should return Hello World!', () => {
    expect(controller.getHello()).toBe('Hello World!');
  });
});
