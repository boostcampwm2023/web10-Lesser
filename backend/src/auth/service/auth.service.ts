import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubApiService } from 'src/github-api/github-api.service';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRETS,
} from 'src/lesser-config/constants';
import { GithubUserDto } from './dto/github-user.dto';
import { TempMemberRepository } from '../repository/tempMember.repository';
import { TempMember } from '../entity/tempMember.entity';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { v4 as uuidv4 } from 'uuid';
import { MemberService } from 'src/member/service/member.service';
import { LoginMemberRepository } from '../repository/loginMember.repository';
import { LoginMember } from '../entity/loginMember.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly githubApiService: GithubApiService,
    private readonly tempMemberRepository: TempMemberRepository,
    private readonly lesserJwtService: LesserJwtService,
    private readonly memberService: MemberService,
    private readonly loginMemberRepository: LoginMemberRepository,
  ) {}
  private readonly ENV_GITHUB_CLIENT_ID =
    this.configService.get(GITHUB_CLIENT_ID);

  getGithubAuthUrl(): string {
    return `https://github.com/login/oauth/authorize?client_id=${this.ENV_GITHUB_CLIENT_ID}&scope=`;
  }

  async githubAuthentication(
    authCode: string,
  ): Promise<
    { tempIdToken: string } | { accessToken: string; refreshToken: string }
  > {
    const githubAccessToken = await this.getAccessToken(authCode);
    const githubUser = await this.getGithubUser(githubAccessToken);
    const member = await this.memberService.findByGithubId(githubUser.githubId);
    if (member) {
      const [accessToken, refreshToken] = await Promise.all([
        this.lesserJwtService.createAccessToken(member.id),
        this.lesserJwtService.createRefreshToken(member.id),
      ]);
      await this.loginMemberRepository.save(
        LoginMember.of(member.id, refreshToken),
      );
      return { accessToken, refreshToken };
    } else {
      const tempIdToken = await this.saveTempMember(githubUser);
      return { tempIdToken };
    }
  }

  async getAccessToken(authCode: string) {
    try {
      const body = {
        client_id: this.configService.get(GITHUB_CLIENT_ID),
        client_secret: this.configService.get(GITHUB_CLIENT_SECRETS),
        code: authCode,
      };
      const { access_token } =
        await this.githubApiService.fetchAccessToken(body);
      if (!access_token) throw new Error('Invalid authorization code');
      return access_token;
    } catch (err) {
      throw new Error('Cannot retrieve access token');
    }
  }

  async getGithubUser(accessToken: string) {
    try {
      const { id, login, avatar_url } =
        await this.githubApiService.fetchGithubUser(accessToken);
      const githubUser = GithubUserDto.of(id, login, avatar_url);
      return githubUser;
    } catch (err) {
      throw new Error('Cannot retrieve github user');
    }
  }

  async saveTempMember(githubUser: GithubUserDto): Promise<string> {
    const { githubId, githubUsername, githubImageUrl } = githubUser;
    const tempMember = await this.tempMemberRepository.findByGithubId(githubId);

    if (tempMember) {
      const updatedTempIdToken = await this.lesserJwtService.createTempIdToken(
        tempMember.uuid,
      );
      await this.tempMemberRepository.updateTempIdToken(
        tempMember.uuid,
        updatedTempIdToken,
      );
      return updatedTempIdToken;
    } else {
      const uuid: string = uuidv4();
      const tempIdToken = await this.lesserJwtService.createTempIdToken(uuid);
      await this.tempMemberRepository.save(
        TempMember.of(
          uuid,
          tempIdToken,
          githubId,
          githubUsername,
          githubImageUrl,
        ),
      );
      return tempIdToken;
    }
  }

  async githubSignup(
    tempIdToken: string,
    username: string,
    position: string,
    techStack: object,
  ) {
    const tempMember = await this.getTempMember(tempIdToken);
    const memberId = await this.memberService.save(
      tempMember.github_id,
      tempMember.username,
      tempMember.image_url,
      username,
      position,
      techStack,
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.lesserJwtService.createAccessToken(memberId),
      this.lesserJwtService.createRefreshToken(memberId),
    ]);
    await this.loginMemberRepository.save(
      LoginMember.of(memberId, refreshToken),
    );
    return { accessToken, refreshToken };
  }

  async getTempMember(tempIdToken: string): Promise<TempMember> {
    const payload = await this.lesserJwtService.getPayload(
      tempIdToken,
      'tempId',
    );
    const tempMember = await this.tempMemberRepository.findByUuid(
      payload.sub.uuid,
    );
    if (tempMember.temp_id_token !== tempIdToken)
      throw new Error('tempIdToken does not match');
    return tempMember;
  }

  async logout(accessToken: string) {
    const { sub } = await this.lesserJwtService.getPayload(
      accessToken,
      'access',
    );
    const memberId = sub.id;
    const deletedCount: number =
      await this.loginMemberRepository.deleteByMemberId(memberId);
    if (deletedCount === 0) throw new Error('Not a logged in member');
  }

  async refreshAccessTokenAndRefreshToken(refreshToken: string) {
    const { sub } = await this.lesserJwtService.getPayload(
      refreshToken,
      'refresh',
    );
    const memberId = sub.id;
    const newRefreshToken =
      await this.lesserJwtService.createRefreshToken(memberId);
    const updatedCount = await this.loginMemberRepository.updateRefreshToken(
      memberId,
      refreshToken,
      newRefreshToken,
    );
    if (updatedCount === 0) throw new Error('No matching refresh token');
    const newAccessToken =
      await this.lesserJwtService.createAccessToken(memberId);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
