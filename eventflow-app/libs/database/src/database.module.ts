import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
 
import { ConfigModule } from '@nestjs/config';

@Global() //NOTICE HERE !!
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Optional: makes the module available across the entire app
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})

export class DatabaseModule {}
