# TASKS

This document outlines the main tasks and workflows for the `nest-js-kafka-postgres-microservices` project.

## Project Setup

1. Install dependencies
   - `cd eventflow-app`
   - `npm install`

2. Run Nest apps
   - `npm run start:dev` or `nest start --watch`
   - run individual apps if needed:
     - `nest start --watch api-gateway`
     - `nest start --watch auth-service`

3. Configure environment
   - create/update `eventflow-app/.env`
   - set `DATABASE_URL='postgresql://admin:password@localhost:5433/eventflow-db?schema=public'`
   - set `JWT_SECRET` and other env values

## Database Tasks

1. PostgreSQL connection
   - ensure PostgreSQL is running on `localhost:5433`
   - verify credentials: user `admin`, password `password`
   - verify database `eventflow-db`

2. Run Drizzle migrations
   - `npx drizzle-kit push`
   - check `drizzle.config.ts` for database config

## Kafka Tasks

1. Start Kafka and create topics
   - ensure Kafka is available at `localhost:9092`
   - manually create topics used by the app, for example:
     - `user.registered`
     - `user.login`
     - `event.created`
     - `event.updated`
     - `payment.completed`
     - `notification.send.email`

2. Verify consumer groups
   - confirm `eventflow-app-consumer-client` consumer group exists
   - validate subscriptions in Kafka UI or CLI

## Development Tasks

1. Add or update endpoints
   - API Gateway and auth-service routes live under `apps/api-gateway/src` and `apps/auth-service/src`
   - use `libs/common/src` and `libs/kafka/src` shared code where appropriate

2. Add business logic
   - implement user auth, registration, login flows
   - publish Kafka events from auth-service
   - consume Kafka events in other services as needed

## Testing Tasks

1. Run unit tests
   - `npm test`
   - `npm run test:watch`

2. Run end-to-end tests
   - `npm run test:e2e`

## Maintenance Tasks

1. Code formatting
   - `npm run format`

2. Linting
   - `npm run lint`

3. Dependency updates
   - keep NestJS, Kafka, PostgreSQL client, and Drizzle versions current
