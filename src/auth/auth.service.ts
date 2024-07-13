import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_TOKEN } from './constants/token.type';
import { TokenOutput } from './dtos/create.token.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(input: JWT_TOKEN): Promise<TokenOutput> {
    const payload: JWT_TOKEN = {
      id: input.id,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRET,
      expiresIn: '3h',
    });
    return { ok: true, accessToken };
  }
}
