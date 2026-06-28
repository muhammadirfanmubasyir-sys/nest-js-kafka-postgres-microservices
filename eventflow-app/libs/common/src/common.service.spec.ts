import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from './common.service';

import { beforeEach, describe, it } from 'node:test';
import { expect, jest, test } from '@jest/globals';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonService],
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  it('should be OK 1', () => {
    expect(service).toBeDefined();
  });

  
  it('should be OK 2', () => {
    expect(true).toBe(true);
  });
 
});
