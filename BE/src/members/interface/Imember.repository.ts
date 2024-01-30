import { Member } from '../domain/entity/member.entity';

export interface IMemberRepository {
  findIn(memberList: number[]): Promise<Member[]>;
  findById(id: number): Promise<Member>;
  findByGithubId(id: string): Promise<Member>;
  findById(id: number): Promise<Member>;
  searchByUsername(username: string): Promise<Member[]>;
  save(member: Member): Promise<Member>;
}
