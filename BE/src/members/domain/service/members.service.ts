import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LesserJwtService } from 'src/common/lesser-jwt/lesser-jwt.service';
import { GithubOauthService } from 'src/github-api/oauth.service';
import { GithubResourceService } from 'src/github-api/resource.service';
import { GithubUser } from 'src/github-api/dto/github.dto';
import { Member } from '../entity/member.entity';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import { MemberSearchListDto } from '../dto/member.dto';
import { Tokens } from '../dto/tokens.dto';
import { IMemberRepository } from 'src/members/interface/Imember.repository';

@Injectable()
export class MembersService {
  constructor(
    @Inject('MemberRepo') private memberRepo: IMemberRepository,
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
    githubUser.setEmail(githubEmail);
    const { github_id } = githubUser;

    const findMember = await this.memberRepo.findByGithubId(github_id);
    const loginMember = findMember ? findMember : await this.signup(githubUser);
    const memberId = loginMember.id;

    const [lesserAccessToken, lesserRefreshToken] = await Promise.all([
      this.lesserJwtService.getAccessToken(memberId),
      this.lesserJwtService.getRefreshToken(memberId),
    ]);

    this.loggedMembers.set(lesserRefreshToken, { memberId });

    const response: LoginResponseDto = {
      id: loginMember.id,
      username: loginMember.username,
      imageUrl: loginMember.image_url,
      accessToken: lesserAccessToken,
      refreshToken: lesserRefreshToken,
    };
    return response;
  }

  async signup(githubUser: GithubUser): Promise<Member> {
    const { github_id, username, email, image_url } = githubUser;
    const newMember = Member.createMember(github_id, username, email, image_url);
    const savedMember = await this.memberRepo.save(newMember);
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

  async searchMembersByName(username: string): Promise<MemberSearchListDto[]> {
    const members = await this.memberRepo.searchByUsername(username);
    if (members.length === 0) throw new NotFoundException(`Member with username '${username}' not found.`);
    const response: MemberSearchListDto[] = members.map((member) => ({
      id: member.id,
      username: member.username,
      imageUrl: member.image_url,
    }));
    return response;
  }
}
