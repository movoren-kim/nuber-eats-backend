import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { GraphQLError } from 'graphql';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/skip-auth';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokenAuthorizationInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) return next.handle();
      const request = GqlExecutionContext.create(context).getContext().req;
      const accessToken = request.headers['access-token'];

      // access token을 decode
      const accessPayload = this.jwtService.verify(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });

      const payloadInfo = await this.usersService.findById(accessPayload.id);
      request['user'] = payloadInfo;
      return next.handle();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new GraphQLError('[Interceptor] 액세스 토큰이 만료되었습니다.', {
          extensions: { code: 400 },
        });
      } else {
        throw new GraphQLError(
          error.message ||
            '[Interceptor] 토큰 검증 중 알 수 없는 에러가 발생하였습니다.',
          {
            extensions: { code: 402 },
          },
        );
      }
    }
  }
}
