import { sleep } from './sleep.util';

describe('sleep', () => {
  it('should resolve after the specified time', async () => {
    const start = Date.now();
    await sleep(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(90);
  });

  it('should return a promise', () => {
    const result = sleep(10);
    expect(result).toBeInstanceOf(Promise);
  });
});
