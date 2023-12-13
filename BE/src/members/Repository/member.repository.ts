import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { Member } from '../domain/entity/member.entity';
import { IMemberRepository } from './Imember.repository';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(private readonly dataSource: DataSource) {}
  async findIn(memberList: number[]): Promise<Member[]> {
    return this.dataSource.getRepository(Member).find({ where: { id: In(memberList) } });
  }
}
