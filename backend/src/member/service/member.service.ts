import { Injectable } from '@nestjs/common';
import { Member } from '../entity/member.entity';
import { MemberRepository } from '../repository/member.repository';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}
  findByGithubId(githubId: number): Promise<Member> {
    return this.memberRepository.findByGithubId(githubId);
  }
}
