import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TempMember } from '../entity/tempMember.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TempMemberRepository {
  constructor(
    @InjectRepository(TempMember)
    private readonly tempMemberRepository: Repository<TempMember>,
  ) {}

  async save(tempMember: TempMember): Promise<string> {
    const { uuid } = await this.tempMemberRepository.save(tempMember);
    return uuid;
  }

  findByGithubId(githubId: number): Promise<TempMember> {
    return this.tempMemberRepository.findOneBy({ github_id: githubId });
  }

  async updateTempIdToken(uuid: string, tempIdToken: string): Promise<void> {
    this.tempMemberRepository.update(uuid, { temp_id_token: tempIdToken });
  }
}
