import { SERVICES_PORTS } from '@app/common/constants/services.constants';
import { DatabaseService, users } from '@app/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { Injectable, Logger, Inject, OnModuleInit, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { log, time } from 'console';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthServiceService implements OnModuleInit {

  private readonly LOGGER = new Logger(AuthServiceService.name);
  
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
 
    // Connect to the Kafka broker
    await this.kafkaClient.connect();
  }
 
  async simulateUserRegistration(email: string) {
    // Publish event to the 'USER_REGISTERED' topic
    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, { 
        email,
        timestamp: new Date().toISOString(),
    });

    this.LOGGER.log(`Published event to topic ${KAFKA_TOPICS.USER_REGISTERED} with email: ${email}`);
    
    return  { message: `User registered : ${email}` };
  }

  async register(email: string, password: string, name: string) {
    //check existing user 
    const existingUser = await this.dbService.db
                            .select().from(users)
                            .where(eq(users.email, email))
                            .limit(1);
    
    if (existingUser.length > 0) {
      throw new ConflictException('User already existed');
    }                        
   
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const [user] = await this.dbService.db
                        .insert(users)
                        .values({ email, password: hashedPassword, name })
                        .returning();

    this.LOGGER.log(`Successfully insert table USERS, ID = ${user.id}`);

    // send user registered event
    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, { 
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
    });

    this.LOGGER.log(`EventPattern :: Published event to Kafka-Topic : ${KAFKA_TOPICS.USER_REGISTERED} with email: ${email}`);

    return {
      message: 'User registered successfully..', 
      userId: user.id
    };

  }

  async login(email: string, password: string) {
    const [user] = await this.dbService.db
                            .select()
                            .from(users)
                            .where(eq(users.email, email))
                            .limit(1);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials')
    }                        

    const token = this.jwtService.sign({ sub: user.id, email: user.email});

    this.LOGGER.log(`Succesfully, created TOKEN: ${token}`)

    // send user login event
    this.kafkaClient.emit(KAFKA_TOPICS.USER_LOGIN, { 
        userId: user.id,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
    });

    this.LOGGER.log(`EventPattern :: Succesfully, send msg to Kafka-Topic: ${KAFKA_TOPICS.USER_LOGIN}`)

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }

  }

  async getProfile(userId: string) {
    const [user] = await this.dbService.db
                        .select({
                            id: users.id,
                            email: users.email,
                            name: users.name,
                            role: users.role,
                        })
                        .from(users)
                        .where(eq(users.id, userId))
                        .limit(1);
    if (!user) {
      throw new UnauthorizedException('User not found');
      this.LOGGER.log(`User with ID ${userId} not found`);
    }

    return user;

  }

  handleUserRegisteredEvent(message: any) {
    const payload = message?.value ?? message;
    const event = typeof payload === 'string' ? JSON.parse(payload) : payload;

    this.LOGGER.log(`EventPattern :: Received message from topic ${KAFKA_TOPICS.USER_REGISTERED}: ${JSON.stringify(event)}`);
    const { userId, email, timestamp } = event || {};

    this.LOGGER.log(
      `EventPattern :: Parsed USER_REGISTERED event: userId=${userId}, email=${email}, timestamp=${timestamp}`,
    );
  }

  handleUserLoginMessage(message: any) {
    const payload = message?.value ?? message;
    const event = typeof payload === 'string' ? JSON.parse(payload) : payload;

    this.LOGGER.log(`EventPattern :: Received message from topic ${KAFKA_TOPICS.USER_LOGIN}: ${JSON.stringify(event)}`);

    const { userId, timestamp } = event || {};

    this.LOGGER.log(
      `EventPattern :: Parsed USER_LOGIN event: userId=${userId}, timestamp=${timestamp}`,
    );
  }

  getHello(): string {
    return `Auth Service is running on port ${SERVICES_PORTS.AUTH_SERVICE}`;
  }
}
