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
