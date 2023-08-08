import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { ExtendedRequest } from './auth.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userEmail = decoded.email;
      } catch (e) {}
    } else {
      throw new HttpException("Don't have access", HttpStatus.FORBIDDEN);
    }
    next();
  }
}
