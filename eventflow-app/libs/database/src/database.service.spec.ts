jest.mock('pg', () => {
  const mockPool = {
    end: jest.fn().mockResolvedValue(undefined),
  };
  return { Pool: jest.fn(() => mockPool) };
});

jest.mock('drizzle-orm/node-postgres', () => {
  return {
    drizzle: jest.fn(() => ({})),
  };
});

import { DatabaseService } from './database.service';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockPool: { end: jest.Mock };

  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://admin:password@localhost:5433/eventflow-db';
    jest.clearAllMocks();
    service = new DatabaseService();
    mockPool = (Pool as unknown as jest.Mock).mock.results[0].value;
  });

  afterEach(() => {
    delete process.env.DATABASE_URL;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a Pool with DATABASE_URL', () => {
    expect(Pool).toHaveBeenCalledWith({
      connectionString: 'postgresql://admin:password@localhost:5433/eventflow-db',
    });
  });

  it('should initialize drizzle with the pool and schema', () => {
    expect(drizzle).toHaveBeenCalled();
  });

  it('should throw if DATABASE_URL is not set', () => {
    delete process.env.DATABASE_URL;
    expect(() => new DatabaseService()).toThrow('DATABASE_URL environment variable is not defined');
  });

  it('should have a db property', () => {
    expect(service.db).toBeDefined();
  });

  describe('onModuleDestroy()', () => {
    it('should call pool.end()', async () => {
      await service.onModuleDestroy();
      expect(mockPool.end).toHaveBeenCalledTimes(1);
    });
  });
});
