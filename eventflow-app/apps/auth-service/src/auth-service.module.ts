import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { KAFKA_CONSUMER_GROUP, KafkaModule } from '@app/kafka';


@Module({
  imports: [
    KafkaModule.register(KAFKA_CONSUMER_GROUP), // Use the KafkaModule to register the Kafka client
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
