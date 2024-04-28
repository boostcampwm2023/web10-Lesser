import { Injectable } from '@nestjs/common';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { Member } from '../entity/member.entity';
import { MemberRepository } from '../repository/member.repository';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly lesserJwtService: LesserJwtService,
  ) {}
  findByGithubId(githubId: number): Promise<Member> {
    return this.memberRepository.findByGithubId(githubId);
  }

  async save(
    githubId: number,
    githubUsername: string,
    githubImageUrl: string,
    username: string,
    position: string,
    techStack: { stacks: string[] },
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

  async validateUsername(username: string): Promise<void> {
    const member = await this.memberRepository.findByUsername(username);
    if (member !== null) throw new Error('duplicate username');
  }

  async getMemberPublicInfo(
    accessToken: string,
  ): Promise<{ username: string; githubImageUrl: string }> {
    const {
      sub: { id },
    } = await this.lesserJwtService.getPayload(accessToken, 'access');
    const member = await this.memberRepository.findById(id);
    if (!member) throw new Error('assert: member must be found from database');
    return {
      username: member.username,
      githubImageUrl: member.github_image_url,
    };
  }
}
