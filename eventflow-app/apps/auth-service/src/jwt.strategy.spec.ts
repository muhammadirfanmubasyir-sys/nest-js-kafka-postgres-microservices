import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    strategy = new JwtStrategy();
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should throw if JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET;
    expect(() => new JwtStrategy()).toThrow('JWT_SECRET environment variable is not defined');
  });

  describe('validate()', () => {
    it('should return userId and email from valid payload', () => {
      const payload = { sub: '123', email: 'test@test.com', iat: 1000, exp: 2000 };
      const result = strategy.validate(payload);
      expect(result).toEqual({ userId: '123', email: 'test@test.com' });
    });

    it('should throw UnauthorizedException if payload is null', () => {
      expect(() => strategy.validate(null)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if payload is undefined', () => {
      expect(() => strategy.validate(undefined)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if sub is missing', () => {
      const payload = { sub: '', email: 'test@test.com' };
      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email is missing', () => {
      const payload = { sub: '123', email: '' };
      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with message', () => {
      const payload = { sub: '', email: '' };
      try {
        strategy.validate(payload);
        fail('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('Invalid JWT payload');
      }
    });
  });
});
