import { Injectable } from '@nestjs/common';
import { Member } from '../entity/member.entity';
import { MemberRepository } from '../repository/member.repository';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}
  findByGithubId(githubId: number): Promise<Member> {
    return this.memberRepository.findByGithubId(githubId);
  }

  async save(
    githubId: number,
    githubUsername: string,
    githubImageUrl: string,
    username: string,
    position: string,
    techStack: object,
  ): Promise<number> {
    const member = await this.memberRepository.create(
      Member.of(
        githubId,
        githubUsername,
        githubImageUrl,
        username,
        position,
        techStack,
      ),
    );
    return member.id;
  }
}
