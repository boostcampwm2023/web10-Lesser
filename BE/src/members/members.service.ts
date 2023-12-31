import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { MemberSearchResponseDto } from './dto/member.dto';
import { GithubUser } from './dto/github-user.dto';
import { Tokens } from './dto/tokens.dto';
import { LesserJwtService } from 'src/common/lesser-jwt/lesser-jwt.service';
import { GithubEmail } from 'src/common/types/githubResource.type';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private lesserJwtService: LesserJwtService,
    private configService: ConfigService,
  ) {}
  private loggedMembers = new Map();

  async githubLogin(dto: LoginRequestDto) {
    const githubAccessToken = await this.getGithubAccessToken(dto.code);
    const [githubUser, githubEmail] = await Promise.all([
      this.fetchGithubUser(githubAccessToken),
      this.fetchGithubEmail(githubAccessToken),
    ]);
    githubUser.email = githubEmail;
    const { github_id } = githubUser;

    const findMember = await this.memberRepository.findOne({ where: { github_id } });
    let memberId = findMember ? findMember.id : null; // user 정보 없으면 회원가입
    if (!findMember) {
      const newMember = this.memberRepository.create({
        github_id: githubUser.github_id,
        username: githubUser.username,
        email: githubUser.email,
        image_url: githubUser.image_url,
      });
      const savedMember = await this.memberRepository.save(newMember);
      memberId = savedMember.id;
    }

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

  logout(id: number) {
    for (let [refreshToken, memberId] of this.loggedMembers.entries()) {
      if (memberId === id) {
        this.loggedMembers.delete(refreshToken);
        break;
      }
    }
  }

  async refresh(refreshToken: string) {
    const memberId = this.loggedMembers.get(refreshToken).memberId;
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

  async getGithubAccessToken(code: string) {
    const body = {
      client_id: this.configService.get('GITHUB_CLIENT_ID'),
      client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
      code: code,
    };
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });
      const oauthData = await response.json();
      const accessToken = oauthData.access_token;
      return accessToken;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async fetchGithubUser(accessToken: string): Promise<GithubUser> {
    try {
      const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const githubUser: GithubUser = {
        github_id: data.id,
        username: data.login,
        email: data.email,
        image_url: data.avatar_url,
      };
      return githubUser;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async fetchGithubEmail(accessToken: string): Promise<string> {
    try {
      const response = await fetch('https://api.github.com/user/emails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const emailList: GithubEmail[] = await response.json();
      const primaryEmail = emailList.find((email) => email.primary === true);
      return primaryEmail.email;
    } catch (err) {
      throw new Error(err.message);
    }
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
