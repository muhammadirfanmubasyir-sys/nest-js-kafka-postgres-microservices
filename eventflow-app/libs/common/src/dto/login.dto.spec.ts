import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'test@test.com',
      password: 'secret123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when email is missing', async () => {
    const dto = plainToInstance(LoginDto, {
      password: 'secret123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when email is invalid', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'bad',
      password: 'secret123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when password is missing', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'test@test.com',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail when password is shorter than 6 characters', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'test@test.com',
      password: '123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
});
