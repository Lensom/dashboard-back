import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserRegistrationSchema } from './auth.model';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserRegistrationSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'user/get-info',
        method: RequestMethod.GET,
      },
      {
        path: 'portfolio/add-stock',
        method: RequestMethod.POST,
      },
      {
        path: 'portfolio',
        method: RequestMethod.GET,
      },
      {
        path: 'portfolio/:symbol',
        method: RequestMethod.DELETE,
      },
    );
  }
}
