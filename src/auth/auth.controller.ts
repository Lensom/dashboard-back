import { Controller, Post, Body } from '@nestjs/common';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  registration(@Body() userData: User) {
    return this.authService.registration(userData);
  }
}
