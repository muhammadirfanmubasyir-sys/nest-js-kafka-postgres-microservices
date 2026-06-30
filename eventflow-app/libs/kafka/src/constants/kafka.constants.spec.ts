import {
  KAFKA_BROKER,
  KAFKA_CLIENT_ID,
  KAFKA_CONSUMER_GROUP,
  KAFKA_TOPICS,
} from './kafka.constants';

describe('KafkaConstants', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('KAFKA_BROKER', () => {
    it('should use default value when env var is not set', () => {
      delete process.env.KAFKA_BROKER;
      expect(KAFKA_BROKER).toBe('localhost:9092');
    });
  });

  describe('KAFKA_CLIENT_ID', () => {
    it('should use default value when env var is not set', () => {
      delete process.env.KAFKA_CLIENT_ID;
      expect(KAFKA_CLIENT_ID).toBe('eventflow-app');
    });
  });

  describe('KAFKA_CONSUMER_GROUP', () => {
    it('should use default value when env var is not set', () => {
      delete process.env.KAFKA_CONSUMER_GROUP;
      expect(KAFKA_CONSUMER_GROUP).toBe('eventflow-app-consumer');
    });
  });

  describe('KAFKA_TOPICS', () => {
    it('should have all required topics', () => {
      expect(KAFKA_TOPICS.USER_REGISTERED).toBe('user.registered');
      expect(KAFKA_TOPICS.USER_LOGIN).toBe('user.login');
      expect(KAFKA_TOPICS.PASSWORD_RESET_REQUESTED).toBe('password.reset.requested');
      expect(KAFKA_TOPICS.EVENT_CREATED).toBe('event.created');
      expect(KAFKA_TOPICS.EVENT_UPDATED).toBe('event.updated');
      expect(KAFKA_TOPICS.EVENT_CANCELLED).toBe('event.cancelled');
      expect(KAFKA_TOPICS.TICKET_PURCHASED).toBe('ticket.purchased');
      expect(KAFKA_TOPICS.TICKET_CANCELLED).toBe('ticket.cancelled');
      expect(KAFKA_TOPICS.TICKET_CHECKED_IN).toBe('ticket.checked_in');
      expect(KAFKA_TOPICS.PAYMENT_COMPLETED).toBe('payment.completed');
      expect(KAFKA_TOPICS.PAYMENT_FAILED).toBe('payment.failed');
      expect(KAFKA_TOPICS.PAYMENT_REFUNDED).toBe('payment.refunded');
      expect(KAFKA_TOPICS.SEND_EMAIL).toBe('notification.send.email');
      expect(KAFKA_TOPICS.SEND_PUSH).toBe('notification.send.push');
    });

    it('should have 14 topics', () => {
      const keys = Object.keys(KAFKA_TOPICS);
      expect(keys.length).toBe(14);
    });
  });
});
