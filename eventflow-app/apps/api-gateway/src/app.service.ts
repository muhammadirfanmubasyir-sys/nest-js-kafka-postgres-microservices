import { SERVICES_PORTS } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo(): string {
    return `API Gateway is running on port ${SERVICES_PORTS.API_GATEWAY}`;
  }

  getHello(): string {
    return "Hello World!";
  }
}
