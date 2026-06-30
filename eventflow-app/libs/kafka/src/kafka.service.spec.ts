import { KafkaService } from './kafka.service';

describe('KafkaService', () => {
  let service: KafkaService;

  beforeEach(() => {
    service = new KafkaService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
