import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRATION,
  EXPIRED_MSG,
  INVALID_MSG,
  NO_USER_MSG,
  REFRESH_TOKEN_EXPIRATION,
  UNKNOWN_MSG,
} from './constants';

@Injectable()
export class LesserJwtService {
  constructor(private readonly jwtService: JwtService) {}
  getAccessToken(userId: string) {
    const payload = { sub: userId };
    const options = { expiresIn: ACCESS_TOKEN_EXPIRATION };
    return this.jwtService.signAsync(payload, options);
  }

  getRefreshToken() {
    const payload = {};
    const options = { expiresIn: REFRESH_TOKEN_EXPIRATION };
    return this.jwtService.signAsync(payload, options);
  }

  async getUserId(accessToken: string) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(accessToken);
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new UnauthorizedException(EXPIRED_MSG);
      if (e instanceof JsonWebTokenError) throw new UnauthorizedException(INVALID_MSG);
      throw new UnauthorizedException(UNKNOWN_MSG);
    }
    if (payload.sub === undefined) console.log(NO_USER_MSG);
    return payload.sub;
  }

  async veifryToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
