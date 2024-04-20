import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { Member } from 'src/member/entity/member.entity';
import { MemberRepository } from 'src/member/repository/member.repository';
import { BearerTokenRequest } from '../middleware/parse-bearer-token.middleware';

export interface MemberRequest extends BearerTokenRequest {
  member: Member;
}

export const Public = Reflector.createDecorator<void>();

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly lesserJwtService: LesserJwtService,
    private readonly memberRepository: MemberRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicRoute(context)) {
      return true;
    }
    const request: MemberRequest = context.switchToHttp().getRequest();
    const accessToken = request.token;
    if (!accessToken)
      throw new UnauthorizedException('Bearer Token is missing');
    const {
      sub: { id },
    } = await this.lesserJwtService.getPayload(accessToken, 'access');
    const member = await this.memberRepository.findById(id);
    if (!member) throw new Error('assert: member must be found from database');
    request.member = member;
    return true;
  }

  private isPublicRoute(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<{} | undefined>(Public, [
      context.getHandler(),
      context.getClass(),
    ]);
    return !!isPublic;
  }
}
