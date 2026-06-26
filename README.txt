README
=======
1. npm i -g @nestjs/cli

2. nest new eventflow-app

3. cd eventflow-app
nest g app auth-service
 
--------------
dir structure 
=============
eventflow-app
  apps    
    auth-service
    eventflow-app => 4. rename to api-gateway

dir structure 
=============
eventflow-app
  apps    
    auth-service
    api-gateway
      -tsconfig.app.json (7)
  -nest-cli.json (5)
  -package.json (6)

5. edit nest-cli.json -> replace all "eventflow-app" to "api-gateway"
6. edit package.json -> replace all "eventflow-app" to "api-gateway" 

7. edit tsconfig.app.json -> replace all "eventflow-app" to "api-gateway" 

IN:  D:\PROJECTS\nest-js-kafka-postgres-microservices\eventflow-app> 
8. nest start --watch api-gateway 

9. nest start --watch auth-service


10. nest start --watch event-service

cd eventflow-app
nest g lib common
nest g lib database
nest g lib kafka

dir structure 
==============
eventflow-app
  apps
    api-gateway
    auth-service
  libs
    common   
    database
    kafka

======= KAFKA n MICROSERVICES ========
IN :   D:\PROJECTS\nest-js-kafka-postgres-microservices\eventflow-app> 
npm i --save @nestjs/microservices kafkajs
npm i --save kafkajs
nest g lib kafka
----------------------------------------------------
REQUEST:
POST: localhost:3001/register
{
	"email": "bismillah@gmail.com"
}

RESPONSE: 201
{
    "message": "User registered : bismillah@gmail.com"
}

SAMPLE .env
===========
DATABASE_URL='postgresql://admin:password@localhost:5433/eventflow-db?schema=public'

JWT_SECRET=Bismillah99

------------- ORM POSTGRES ------------
npm i --save drizzle-orm
npm i --save pg
npm i --save-dev @types/pg
npm i --save -D drizzle-kit   => D = DEV
----------------------------------------
D:\PROJECTS\nest-js-kafka-postgres-microservices\eventflow-app>npx drizzle-kit push

No config path provided, using default 'drizzle.config.ts'
Reading config file 'D:\PROJECTS\nest-js-kafka-postgres-microservices\eventflow-app\drizzle.config.ts'
Using 'pg' driver for database querying
[✓] Pulling schema from database...
[✓] Changes applied

------------------------ AUTHENTICATION ------------------------------
npm i --save bcrypt @nestjs/jwt @nestjs/passport passport passport-jwt

npm i --save @types/bcrypt @types/passport-jwt -D

================================================================================== 
UnknownTopicOrPartitionException: This server does not host this topic-partition 
=> You must create topic first, wait for some second.., then run the project !!!
---------------------------------------------------------------------------------- 

AFTER KAFKA-UI UP (http://localhost:8080):
- TOPIC MUST MANUALLY CREATED: user.registered
- RUN NEST JS: nest start --watch auth-service
- CONSUMER CREATED OTOMATIC: eventflow-app-consumer-client (http://localhost:8080/ui/clusters/local/consumer-groups)

MANUALLY CREATE TABLE POSTGRES!!
================================
npx drizzle-kit push

CREATE ENV CONFIG
=================
npm install @nestjs/config

----------------------------
REQUEST: Register User

POST: localhost:3001/register
-------------------------------------
{
	"email": "m.irfan@gmail.com",
    "name": "Irfan",
    "password": "abc123"
}

RESPONSE: 201 (Created)

    "message": "User registered successfully..",
    "userId": "95a1aab5-82c9-4c21-835a-8f1ad77f2974"
}
---------------------------------------------------
REQUEST: Login

POST: localhost:3001/login
{
	"email": "m.irfan@gmail.com",
  "password": "abc123"
}

RESPONSE: 201 (Created)
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NWExYWFiNS04MmM5LTRjMjEtODM1YS04ZjFhZDc3ZjI5NzQiLCJlbWFpbCI6Im0uaXJmYW5AZ21haWwuY29tIiwiaWF0IjoxNzc4NTc5ODA3LCJleHAiOjE3Nzg2NjYyMDd9.UeOnkKhdu-ymAiYiHDBqQw1M8A8MDJl4YrWfh7GmxtM",
    "user": {
        "id": "95a1aab5-82c9-4c21-835a-8f1ad77f2974",
        "email": "m.irfan@gmail.com",
        "name": "m.irfan@gmail.com",
        "role": "USER"
    }
}
-----------------------------------------------------------------
REQUEST: GET profile

GET: localhost:3001/profile/9088e9c7-58df-4434-8aac-14d05ed89795
Header: Authorization
Value: 'BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MDg4ZTljNy01OGRmLTQ0MzQtOGFhYy0xNGQwNWVkODk3OTUiLCJlbWFpbCI6ImFpc3lhaEBnbWFpbC5jb20iLCJpYXQiOjE3Nzg1ODA3MDQsImV4cCI6MTc3ODY2NzEwNH0.BkUGTWixEDbF3M5N3S-1WC3p-Kao93-P4Uj13qAxu4E'

RESPONSE: 200 (OK)
{
    "id": "9088e9c7-58df-4434-8aac-14d05ed89795",
    "email": "aisyah@gmail.com",
    "name": "Aisyah",
    "role": "USER"
}
---------------------------------------------------------------
GET: localhost:3001/profile/36bd8131-a274-465f-9243-984c28adfd96
RESPONSE : 401 (Unathorized)
{
    "message": "Unauthorized",
    "statusCode": 401
}
--------------------------------------------------------------------
GET: localhost:3001/profile/9088e9c7-58df-4434-8aac-14d05ed89795
Header: Authorization
Value: 'BEARER INVALID-TOKEN'

RESPONSE : 401 (Unathorized)
{
    "message": "Unauthorized",
    "statusCode": 401
}
========================================================
VALIDATOR
npm i --save class-validator class-transformer
==============================================
POST: localhost:3001/register
{
	"email": "mubasyir.gmail.com",
    "name": "mubasyir",
    "password": "abc"
}
--
RESPONSE: 400 (BAD REQUEST)
{
    "message": [
        "Please provide a valid email",
        "Password must be 6 characters long"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
--------------------------------------------------
POST: localhost:3001/login
{
	"email": "mubasyir.gmail.com",
    "password": "abc"
}
--
RESPONSE: 400 BAD REQUEST
{
    "message": [
        "Please provide a valid email",
        "Password must be 6 characters long"
    ],
    "error": "Bad Request",
    "statusCode": 400
}

=============== API GATEWAY =====================
npm i @nestjs/axios axios

eventflow-app>nest g module auth --project api-gateway  OR: nest g mo auth --project api-gateway
CREATE apps/api-gateway/src/auth/auth.module.ts (85 bytes)
UPDATE apps/api-gateway/src/app.module.ts (318 bytes)
-----------
eventflow-app>nest g controller auth --project api-gateway --no-spec OR nest g co auth --project api-gateway --no-spec
CREATE apps/api-gateway/src/auth/auth.controller.ts (101 bytes)
UPDATE apps/api-gateway/src/auth/auth.module.ts (170 bytes)
----------
eventflow-app>nest g service auth --project api-gateway --no-spec OR nest g s auth --project api-gateway --no-spec
CREATE apps/api-gateway/src/auth/auth.service.ts (92 bytes)
UPDATE apps/api-gateway/src/auth/auth.module.ts (244 bytes)
----------
POST: localhost:3000/auth/register
{
	"email": "ares@gmail.com",
    "name": "Ares",
    "password": "111111"
}
RESPONSE: 200
{
    "message": "User registered successfully..",
    "userId": "5707bfc2-acbf-4639-a7fa-957056f61ab9"
}
-----------
POST: localhost:3000/auth/login
{
	"email": "ares@gmail.com",
    "password": "111111"
}
RESPONSE: 200
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NzA3YmZjMi1hY2JmLTQ2MzktYTdmYS05NTcwNTZmNjFhYjkiLCJlbWFpbCI6ImFyZXNAZ21haWwuY29tIiwiaWF0IjoxNzc4NzY4MzM5LCJleHAiOjE3Nzg4NTQ3Mzl9.CS8DRYdSNcRHVHCJL1JmH4C67h7wbboGXQ2QswpplS0",
    "user": {
        "id": "5707bfc2-acbf-4639-a7fa-957056f61ab9",
        "email": "ares@gmail.com",
        "name": "Ares",
        "role": "USER"
    }
}
----
GET localhost:3000/auth/profile
HEADER:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NzA3YmZjMi1hY2JmLTQ2MzktYTdmYS05NTcwNTZmNjFhYjkiLCJlbWFpbCI6ImFyZXNAZ21haWwuY29tIiwiaWF0IjoxNzc4NzY4MzM5LCJleHAiOjE3Nzg4NTQ3Mzl9.CS8DRYdSNcRHVHCJL1JmH4C67h7wbboGXQ2QswpplS0
RESPONSE: 200
{
    "id": "5707bfc2-acbf-4639-a7fa-957056f61ab9",
    "email": "ares@gmail.com",
    "name": "Ares",
    "role": "USER"
}
---
GET localhost:3000/auth/profile
HEADER:
Authorization: Invalid-TOKEN
RESPONSE: 401
{
    "statusCode": 401,
    "message": "Unauthorized"
}
========== in eventflow-app ====
npm i @nestjs/mapped-types

nest g app events-service