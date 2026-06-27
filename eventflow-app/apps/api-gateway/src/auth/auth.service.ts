import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SERVICES_PORTS } from '@app/common';
 
@Injectable()
export class AuthService {
    public readonly authServiceUrl = `http://localhost:${SERVICES_PORTS.AUTH_SERVICE}`;

    constructor(private readonly httpService: HttpService) {}

    async register(data: { email: string; password: string; name: string }): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/register`, data)
             );
             return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async login(data: { email: string; password: string; }): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/login`, data)
             );
             return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProfile(bearerAndToken: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.authServiceUrl}/profile`, {
                    headers: { Authorization: bearerAndToken },
                }),
             );
             return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any): never {
        if (error.response) {
            const { status, data } = error.response;
            throw new HttpException(data.message || 'Error from auth service', status);
        }  

        throw new HttpException(error.message || 'Internal server error', 503);
    }
        
}
