README
=======
npm i -g @nestjs/cli

nest new eventflow-app

cd eventflow-app
nest new auth-service
----
dir structure 
=============
eventflow-app
  apps
    api-gateway
    auth-service

SETTING
---------
package.json
nest-cli.json
tsconfig.app.json (in each apps/)

nest start --watch api-gateway

cd eventflow-app
nest g lib common

dir structure 
==============
eventflow-app
  apps
    api-gateway
    auth-service
  libs
    common   

======= KAFKA n MICROSERVICES ========
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
npm i --save -D drizzle-kit
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