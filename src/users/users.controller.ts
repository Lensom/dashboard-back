import { Controller, Post, Body } from '@nestjs/common';
import { User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  createUser(@Body() userData: User) {
    return this.userService.createUser(userData);
  }
}
