import { DynamicModule, Module } from '@nestjs/common';
import { Client, ClientsModule, Transport } from '@nestjs/microservices';
import e from 'express';
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_CONSUMER_GROUP } from './constants/kafka.constants';
 

export const KAFKA_SERVICE = 'KAFKA_SERVICE';

@Module({})
export class KafkaModule {
  static register(consumerGroup?: string): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          {
            name: KAFKA_SERVICE,
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: [KAFKA_BROKER || 'localhost:9092'],
                clientId: KAFKA_CLIENT_ID || 'eventflow-app',
              },
              consumer: {
                groupId: consumerGroup || KAFKA_CONSUMER_GROUP || 'eventflow-app-consumer',
              },
            },
          }
        ]),
      ],  
      exports : [ClientsModule], 
    };
  }  
}  
