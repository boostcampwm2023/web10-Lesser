import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

export interface BearerTokenRequest extends Request {
  headers: Request['headers'] & {
    authorization: string;
  };
  token: string;
}

export class BearerTokenMiddleware implements NestMiddleware {
  use(request: BearerTokenRequest, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      if (bearer === 'Bearer' && token) {
        request.token = token;
      }
    }
    next();
  }
}
