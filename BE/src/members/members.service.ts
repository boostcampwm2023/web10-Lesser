import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { LoginRequestDto } from './dto/login-request.dto';
import { GithubUser } from './dto/member.dto';
import { LesserJwtService } from 'src/common/lesser-jwt/lesser-jwt.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private lesserJwtService: LesserJwtService,
    private configService: ConfigService,
  ) {}

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
      this.lesserJwtService.getRefreshToken(),
    ]);
    return {
      accessToken: lesserAccessToken,
      refreshToken: lesserRefreshToken,
    };
  }

  async getGithubAccessToken(code: string) {
    const body = {
      client_id: this.configService.get('GITHUB_CLIENT_ID'),
      client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
      code: code,
    };
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
  }

  async fetchGithubUser(accessToken: string): Promise<GithubUser> {
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
  }

  async fetchGithubEmail(accessToken: string): Promise<string> {
    const response = await fetch('https://api.github.com/user/emails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const emailList = await response.json();
    console.log(emailList);
    if (!Array.isArray(emailList)) throw new Error('Email list is not an array.');
    const primaryEmail = emailList.find((email) => email.primary === true);
    return primaryEmail.email;
  }
}
