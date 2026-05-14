import { Body, Controller, Get, Injectable, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { LoginDto, RegisterDto } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get()
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @Post('_register_')
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

 
  /**
  * Assuming the JWT payload contains a 'userId' field, we can extract it from the request object.
  * The JwtStrategy will validate the token and attach the payload to the request object, 
  * allowing us to access the userId directly.
  * This approach is more secure and efficient than passing the userId as a URL parameter, 
  * as it relies on the integrity of the JWT token and ensures 
  * that only authenticated users can access their profile information.
  * 
  * See jwt.strategy.ts for how the JWT payload is structured and validated.
  */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: { userId: string } })  // Assuming the JWT payload contains a 'userId' field
  {
    return this.authServiceService.getProfile(req.user.userId);
  }
}
