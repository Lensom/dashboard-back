import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserRegistration, NewUserWithToken, UserLogin } from './auth.model';

@Injectable()
export class AuthService {
  private users: UserRegistration[] = [];

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserRegistration>,
  ) {}

  saltOrRounds = 10;

  async generateJwtToken(user: UserRegistration) {
    const payload = {
      email: user.email,
      username: user.username,
      userId: user._id,
    };
    const options = { expiresIn: '365d' };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);

    return token;
  }

  async hashPassword(password) {
    return bcrypt.hash(password, this.saltOrRounds);
  }

  async registration(data: UserRegistration) {
    try {
      data.password = await this.hashPassword(data.password);
      const newUser = (await this.userModel.create(data)) as NewUserWithToken;
      const token = await this.generateJwtToken(newUser);
      const { password, ...info } = newUser._doc;

      return { ...info, token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login({ email, password }: UserLogin) {
    const user = (await this.userModel.findOne({ email })) as NewUserWithToken;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: pUser, ...info } = user._doc;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.generateJwtToken(user);

    return { ...info, token };
  }

  async getUserById(userId: string) {
    const userInfo = (await this.userModel
      .findById({ _id: userId })
      .exec()) as NewUserWithToken;

    if (!userInfo) {
      throw new NotFoundException('User not found');
    }

    const { password, ...info } = userInfo._doc;
    return info;
  }
}
