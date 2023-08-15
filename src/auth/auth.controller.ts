import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { UserRegistration, UserLogin } from './auth.model';
import { AuthService } from './auth.service';

interface ExtendedRequest extends Request {
  userId?: string;
}

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  registration(@Body() userData: UserRegistration) {
    return this.authService.registration(userData);
  }

  @Post('login')
  login(@Body() userData: UserLogin) {
    return this.authService.login(userData);
  }

  @Get('get-info')
  getInfo(@Req() req: Request) {
    const userId = (req as ExtendedRequest).userId;
    return this.authService.getUserById(userId);
  }
}
