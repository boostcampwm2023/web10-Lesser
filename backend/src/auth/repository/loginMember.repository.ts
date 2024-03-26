import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginMember } from '../entity/loginMember.entity';

@Injectable()
export class LoginMemberRepository {
  constructor(
    @InjectRepository(LoginMember)
    private readonly loginMemberRepository: Repository<LoginMember>,
  ) {}

  async save(loginMember: LoginMember): Promise<number> {
    const { member_id } = await this.loginMemberRepository.save(loginMember);
    return member_id;
  }

  async findByMemberId(memberId: number): Promise<LoginMember> {
    return this.loginMemberRepository.findOneBy({ member_id: memberId });
  }

  async deleteByMemberId(memberId: number): Promise<number> {
    const { affected } = await this.loginMemberRepository.delete({
      member_id: memberId,
    });
    return affected;
  }

  async updateRefreshToken(
    memberId: number,
    refreshToken: string,
    newRefreshToken: string,
  ) {
    const { affected } = await this.loginMemberRepository.update(
      { member_id: memberId, refresh_token: refreshToken },
      { refresh_token: newRefreshToken },
    );
    return affected;
  }
}
