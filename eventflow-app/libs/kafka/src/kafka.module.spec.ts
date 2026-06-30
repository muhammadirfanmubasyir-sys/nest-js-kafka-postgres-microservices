import { KafkaModule, KAFKA_SERVICE } from './kafka.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

describe('KafkaModule', () => {
  it('should be defined', () => {
    expect(KafkaModule).toBeDefined();
  });

  describe('register()', () => {
    it('should return a DynamicModule', () => {
      const result = KafkaModule.register('test-group');
      expect(result).toHaveProperty('module', KafkaModule);
      expect(result).toHaveProperty('imports');
      expect(result).toHaveProperty('exports');
    });

    it('should register a Kafka client with the provided consumer group', () => {
      const result = KafkaModule.register('my-consumer-group');
      const clientsModule = result.imports?.[0];

      expect(clientsModule).toBeDefined();
    });

    it('should use default consumer group when none provided', () => {
      const result = KafkaModule.register();
      expect(result).toHaveProperty('module', KafkaModule);
    });

    it('should export ClientsModule', () => {
      const result = KafkaModule.register('test-group');
      expect(result.exports).toContain(ClientsModule);
    });
  });
});
