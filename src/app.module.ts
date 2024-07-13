import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { User } from './users/entity/user.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TokenAuthorizationInterceptor } from './auth/guard/token.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { TokenAuthenticationGuard } from './auth/guard/token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        // NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        TOKEN_SECRET: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
      formatError: (error) => {
        const GraphQLFormattedError = {
          message: error.message,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            message:
              error.extensions?.originalError?.message ||
              'Message not provided',
          },
        };
        return GraphQLFormattedError;
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_DATABASE,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [User],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: 10800 },
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TokenAuthorizationInterceptor },
    { provide: APP_GUARD, useClass: TokenAuthenticationGuard },
  ],
})
export class AppModule {}
