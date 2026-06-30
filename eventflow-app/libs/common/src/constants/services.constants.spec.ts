import { SERVICES, SERVICES_PORTS } from './services.constants';

describe('ServicesConstants', () => {
  describe('SERVICES', () => {
    it('should have correct service names', () => {
      expect(SERVICES.API_GATEWAY).toBe('api-gateway');
      expect(SERVICES.AUTH_SERVICE).toBe('auth-service');
      expect(SERVICES.USERS_SERVICE).toBe('users-service');
      expect(SERVICES.EVENTS_SERVICE).toBe('events-service');
      expect(SERVICES.TICKETS_SERVICE).toBe('tickets-service');
      expect(SERVICES.PAYMENT_SERVICE).toBe('payment-service');
      expect(SERVICES.NOTIFICATION_SERVICE).toBe('notification-service');
    });
  });

  describe('SERVICES_PORTS', () => {
    it('should have correct port assignments', () => {
      expect(SERVICES_PORTS.API_GATEWAY).toBe(3000);
      expect(SERVICES_PORTS.AUTH_SERVICE).toBe(3001);
      expect(SERVICES_PORTS.USERS_SERVICE).toBe(3002);
      expect(SERVICES_PORTS.EVENTS_SERVICE).toBe(3003);
      expect(SERVICES_PORTS.TICKETS_SERVICE).toBe(3004);
      expect(SERVICES_PORTS.PAYMENT_SERVICE).toBe(3005);
      expect(SERVICES_PORTS.NOTIFICATION_SERVICE).toBe(3006);
    });
  });
});
