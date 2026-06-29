import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getInfo()', () => {
    it('should return status with port number', () => {
      expect(service.getInfo()).toBe('API Gateway is running on port 3000');
    });
  });

  describe('getHello()', () => {
    it('should return Hello World!', () => {
      expect(service.getHello()).toBe('Hello World!');
    });
  });
});
