import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LesserJwtService {
  constructor(private readonly jwtService: JwtService) {}
  createAccessToken(id: number): Promise<string> {
    const payload = { sub: { id }, tokenType: 'access', iat: Date.now() };
    const options = { expiresIn: '15m' };
    return this.jwtService.signAsync(payload, options);
  }

  createRefreshToken(id: number): Promise<string> {
    const payload = { sub: { id }, tokenType: 'refresh', iat: Date.now() };
    const options = { expiresIn: '1d' };
    return this.jwtService.signAsync(payload, options);
  }

  createTempIdToken(uuid: string): Promise<string> {
    const payload = { sub: { uuid }, tokenType: 'tempId', iat: Date.now() };
    const options = { expiresIn: '30m' };
    return this.jwtService.signAsync(payload, options);
  }

  async getPayload(token: string, type: 'access' | 'refresh' | 'tempId') {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.tokenType !== type) throw Error('Invalid token type');
      return payload;
    } catch (error) {
      throw new Error(`Failed to verify token: ${type}`);
    }
  }
}
