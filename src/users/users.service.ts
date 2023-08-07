import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  saltOrRounds = 10;

  async hashPassword(password) {
    return bcrypt.hash(password, this.saltOrRounds);
  }

  async createUser(data: User) {
    try {
      data.password = await this.hashPassword(data.password);
      await this.userModel.create(data);
      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
