# AGENTS

This document describes recommended agent roles and responsibilities for the `nest-js-kafka-postgres-microservices` workspace.

## Purpose

The project is a NestJS-based microservices app using Kafka and PostgreSQL. Agents should focus on:

- understanding NestJS app structure and workspace layout
- correctly handling Kafka topic configuration and microservice communication
- validating database connection and migration setup with PostgreSQL and Drizzle
- preserving TypeScript and NestJS conventions

## Recommended Agent Roles

### 1. Code Assistance Agent

Primary responsibilities:

- analyze code in `eventflow-app/apps/` and `eventflow-app/libs/`
- help implement and refactor NestJS services, controllers, modules, DTOs, and pipe patterns
- assist with Kafka client/consumer setup under `libs/kafka`
- ensure environment-based configuration is used correctly

### 2. DevOps / Setup Agent

Primary responsibilities:

- help configure PostgreSQL connection using `DATABASE_URL`
- validate Docker/Kafka development setup if present
- support `drizzle-kit` schema migrations and database push steps
- verify `npm`/`nest` commands and script usage in `eventflow-app/package.json`

### 3. Testing & Debugging Agent

Primary responsibilities:

- assist with Jest tests in `apps/*/test` and library specs
- help troubleshoot runtime errors, Kafka topic issues, and database access problems
- validate configuration for `@nestjs/config`, JWT auth, and Kafka consumer groups

## Agent Interaction Guidelines

- Prefer using project paths under `eventflow-app/`.
- Avoid rewriting generated NestJS boilerplate unless necessary.
- When asked to modify code, keep changes minimal and targeted.
- Use `KAFKA_TOPICS` constants from `libs/kafka/src/constants/kafka.constants.ts` when referencing Kafka topics.
- Use `DATABASE_URL` from `.env` for PostgreSQL connectivity guidance.
