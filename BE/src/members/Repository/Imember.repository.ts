import { Member } from '../domain/entity/member.entity';

export interface IMemberRepository {
  findIn(memberList: number[]): Promise<Member[]>;
}
