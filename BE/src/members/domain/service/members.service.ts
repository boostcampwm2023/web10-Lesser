import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { LoginRequestDto, LoginResponseDto } from '../../controller/dto/login.dto';
import { MemberSearchResponseDto } from '../../controller/dto/member.dto';
import { Tokens } from '../../controller/dto/tokens.dto';
import { LesserJwtService } from 'src/common/lesser-jwt/lesser-jwt.service';
import { GithubOauthService } from 'src/github-api/oauth.service';
import { GithubResourceService } from 'src/github-api/resource.service';
import { GithubUser } from 'src/github-api/dto/github.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private githubOauthService: GithubOauthService,
    private githubResourceService: GithubResourceService,
    private lesserJwtService: LesserJwtService,
  ) {}
  private loggedMembers = new Map();

  async githubLogin(dto: LoginRequestDto) {
    const githubAccessToken = await this.githubOauthService.getGithubAccessToken(dto.code);
    const [githubUser, githubEmail] = await Promise.all([
      this.githubResourceService.fetchGithubUser(githubAccessToken),
      this.githubResourceService.fetchGithubEmail(githubAccessToken),
    ]);
    githubUser.email = githubEmail;
    const { github_id } = githubUser;

    const findMember = await this.memberRepository.findOne({ where: { github_id } });
    const loginMember = findMember ? findMember : await this.signup(githubUser);
    const memberId = loginMember.id;

    const [lesserAccessToken, lesserRefreshToken] = await Promise.all([
      this.lesserJwtService.getAccessToken(memberId),
      this.lesserJwtService.getRefreshToken(memberId),
    ]);

    this.loggedMembers.set(lesserRefreshToken, { memberId });

    const member = await this.memberRepository.findOne({ where: { id: memberId } });

    const response: LoginResponseDto = {
      id: member.id,
      username: member.username,
      imageUrl: member.image_url,
      accessToken: lesserAccessToken,
      refreshToken: lesserRefreshToken,
    };
    return response;
  }

  async signup(githubUser: GithubUser): Promise<Member> {
    const newMember = this.memberRepository.create({
      github_id: githubUser.github_id,
      username: githubUser.username,
      email: githubUser.email,
      image_url: githubUser.image_url,
    });
    const savedMember = await this.memberRepository.save(newMember);
    return savedMember;
  }

  logout(id: number) {
    for (let [refreshToken, loggedMember] of this.loggedMembers.entries()) {
      if (loggedMember.memberId === id) {
        this.loggedMembers.delete(refreshToken);
        break;
      }
    }
  }

  async refresh(refreshToken: string) {
    const loggedMember = this.loggedMembers.get(refreshToken);
    if (!loggedMember) throw new ForbiddenException('Invalid refresh token.');

    const { memberId } = loggedMember;
    this.loggedMembers.delete(refreshToken);
    const [newAccesToken, newRefreshToken] = await Promise.all([
      this.lesserJwtService.getAccessToken(memberId),
      this.lesserJwtService.getRefreshToken(memberId),
    ]);
    this.loggedMembers.set(newRefreshToken, { memberId });
    const tokens: Tokens = {
      accessToken: newAccesToken,
      refreshToken: newRefreshToken,
    };
    return tokens;
  }

  async searchMembersByName(username: string): Promise<MemberSearchResponseDto[]> {
    const members = await this.memberRepository.find({ where: { username: ILike(`%${username}%`) } });
    if (members.length === 0) throw new NotFoundException(`Member with username '${username}' not found.`);
    const response: MemberSearchResponseDto[] = members.map((member) => ({
      id: member.id,
      username: member.username,
      imageUrl: member.image_url,
    }));
    return response;
  }
}
