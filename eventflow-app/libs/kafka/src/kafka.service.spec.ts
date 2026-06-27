import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from './kafka.service';

import { beforeEach, describe, it } from 'node:test';
import { expect, jest, test } from '@jest/globals';

describe('KafkaService', () => {
  let service: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaService],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
