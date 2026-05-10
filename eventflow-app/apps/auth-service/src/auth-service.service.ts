import { SERVICE_PORTS } from '@app/common/constants/services.constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthServiceService {
  getHello(): string {
    return  `Auth Service is running on port ${SERVICE_PORTS.AUTH_SERVICE}`;
  }
}
