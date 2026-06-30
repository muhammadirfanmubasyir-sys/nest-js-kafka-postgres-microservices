import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'test@test.com',
      password: 'secret123',
      name: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when email is missing', async () => {
    const dto = plainToInstance(RegisterDto, {
      password: 'secret123',
      name: 'Test',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when email is invalid', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'not-an-email',
      password: 'secret123',
      name: 'Test',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when password is missing', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'test@test.com',
      name: 'Test',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail when password is shorter than 6 characters', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'test@test.com',
      password: '123',
      name: 'Test',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail when name is missing', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'test@test.com',
      password: 'secret123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });
});
