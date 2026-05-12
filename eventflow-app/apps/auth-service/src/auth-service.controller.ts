import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { LoginDto, RegisterDto } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get()
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @Post('register_')
  async registerUser(@Body() body: { email: string }) {
    return this.authServiceService.simulateUserRegistration(body.email);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authServiceService.register(dto.email, dto.password, dto.name)
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authServiceService.login(dto.email, dto.password)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    return this.authServiceService.getProfile(userId);
  }
}
