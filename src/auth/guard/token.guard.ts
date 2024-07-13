import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/skip-auth';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Injectable()
export class TokenAuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const ctx = GqlExecutionContext.create(context).getContext();
    const accessToken = ctx.req.headers?.['access-token'];

    if (!accessToken || accessToken === null || accessToken === undefined)
      throw new GraphQLError(
        'access-token이 존재하지 않습니다. 로그아웃 상태로 전환해주세요.',
        { extensions: { code: 401 } },
      );
    return true;
  }
}
