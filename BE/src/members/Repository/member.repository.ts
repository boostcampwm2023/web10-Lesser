import { Injectable } from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { Member } from '../domain/entity/member.entity';
import { IMemberRepository } from '../interface/Imember.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  async findIn(memberList: number[]): Promise<Member[]> {
    return this.dataSource.getRepository(Member).find({ where: { id: In(memberList) } });
  }

  async findById(id: number) {
    return this.memberRepository.findOne({ where: { id } });
  }

  async findByGithubId(id: string) {
    return this.memberRepository.findOne({ where: { github_id: id } });
  }

  async searchByUsername(username: string) {
    return this.memberRepository.find({ where: { username: ILike(`%${username}%`) } });
  }

  async save(member: Member): Promise<Member> {
    return this.memberRepository.save(member);
  }
}
