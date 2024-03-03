import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Member } from '../entity/member.entity';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  findByGithubId(githubId: number): Promise<Member> {
    return this.memberRepository.findOneBy({ github_id: githubId });
  }

  create(member: Member): Promise<Member> {
    return this.memberRepository.save(member);
  }
}
