import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { UserRegistration, UserLogin } from '../models/user.model';
import { AuthService } from './auth.service';

interface ExtendedRequest extends Request {
  userEmail?: string;
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
    const userEmail = (req as ExtendedRequest).userEmail;
    return this.authService.getUserById(userEmail);
  }
}
