import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../repository/member.repository';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}
  findByGithubId(githubId: number) {
    return this.memberRepository.findByGithubId(githubId);
  }
}
