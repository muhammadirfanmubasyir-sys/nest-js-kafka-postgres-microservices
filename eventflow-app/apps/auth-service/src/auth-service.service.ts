import { SERVICE_PORTS } from '@app/common/constants/services.constants';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { log, time } from 'console';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  private readonly logger = new Logger(AuthServiceService.name);
  
  constructor(@Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    // Subscribe to the 'auth-service-topic' topic
    this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.USER_REGISTERED);

    //connect to the Kafka broker
    await this.kafkaClient.connect();
  }
 
  async simulateUserRegistration(email: string) {
    // Publish event to the 'USER_REGISTERED' topic
    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, { 
        email,
        timestamp: new Date().toISOString(),
    });

    this.logger.log(`Published event to topic ${KAFKA_TOPICS.USER_REGISTERED} with email: ${email}`);
    
    return  { message: `User registered : ${email}` };
  }


  getHello(): string {
    return 'Hello World!';
  }
}
