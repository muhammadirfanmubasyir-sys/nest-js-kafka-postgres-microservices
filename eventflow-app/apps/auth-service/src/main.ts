import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';
 
import { ValidationPipe } from '@nestjs/common';
import { SERVICES_PORTS } from '@app/common';
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_CONSUMER_GROUP } from '@app/kafka';
 
async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  // Enable HTTP validation
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    }),
  );

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [KAFKA_BROKER || 'localhost:9092'],
        clientId: KAFKA_CLIENT_ID || 'eventflow-app',
      },
      consumer: {
        groupId: KAFKA_CONSUMER_GROUP || 'eventflow-app-consumer',
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(SERVICES_PORTS.AUTH_SERVICE);

  console.log(`Auth Service is running on port ${SERVICES_PORTS.AUTH_SERVICE}`)
}
bootstrap();
