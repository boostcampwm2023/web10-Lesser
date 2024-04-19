import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { Member } from 'src/member/entity/member.entity';
import { MemberRepository } from 'src/member/repository/member.repository';
import { BearerTokenRequest } from '../middleware/parse-bearer-token.middleware';

export interface MemberRequest extends BearerTokenRequest {
  member: Member;
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly lesserJwtService: LesserJwtService,
    private readonly memberRepository: MemberRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
}
