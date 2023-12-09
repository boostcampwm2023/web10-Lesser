import { Member } from '../entities/member.entity';

export interface IMemberRepository {
  findIn(memberList: number[]): Promise<Member[]>;
}
