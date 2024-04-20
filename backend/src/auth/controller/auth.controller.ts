import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CookieOptions, Response, Request } from 'express';
import { AuthService } from '../service/auth.service';
import { MemberService } from 'src/member/service/member.service';
import { GithubAuthenticationRequestDto } from './dto/GithubAuthenticationRequest.dto';
import { GithubSignupRequestDto } from './dto/GithubSignupRequest.dto';
import { BearerTokenRequest } from 'src/common/middleware/parse-bearer-token.middleware';
import { Public } from 'src/common/guard/authentication.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
  ) {}
  private cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'LOCAL' ? false : true,
    path: '/api/auth/',
    sameSite: 'none',
  };

  @Get('github/authorization-server')
  getGithubAuthServerUrl(@Req() request: Request) {
    const isLocal = request.headers.origin?.includes('localhost');
    return { authUrl: this.authService.getGithubAuthUrl(isLocal) };
  }

  @Post('github/authentication')
  async githubAuthentication(
    @Body() body: GithubAuthenticationRequestDto,
    @Res() response: Response,
  ) {
    const result = await this.authService.githubAuthentication(body.authCode);
    if ('accessToken' in result && 'refreshToken' in result) {
      const { accessToken, refreshToken } = result;
      const { username, githubImageUrl } =
        await this.memberService.getMemberPublicInfo(accessToken);
      const responseBody = {
        accessToken,
        member: { username, imageUrl: githubImageUrl },
      };
      return response
        .status(201)
        .cookie('refreshToken', refreshToken, this.cookieOptions)
        .send(responseBody);
    } else if ('tempIdToken' in result) {
      const responseBody = { tempIdToken: result.tempIdToken };
      return response.status(209).send(responseBody);
    } else throw new Error('assert: unexpected authentication result returned');
  }

  @Post('github/signup')
  async githubSignup(
    @Req() request: BearerTokenRequest,
    @Body() body: GithubSignupRequestDto,
    @Res() response: Response,
  ) {
    const tempIdToken = request.token;
    if (!tempIdToken)
      throw new UnauthorizedException('Bearer Token is missing');

    const { accessToken, refreshToken } = await this.authService.githubSignup(
      tempIdToken,
      body.username,
      body.position,
      { stacks: body.techStack },
    );
    const { username, githubImageUrl } =
      await this.memberService.getMemberPublicInfo(accessToken);
    const responseBody = {
      accessToken,
      member: { username, imageUrl: githubImageUrl },
    };

    return response
      .status(201)
      .cookie('refreshToken', refreshToken, this.cookieOptions)
      .send(responseBody);
  }

  @Post('logout')
  async logout(@Req() request: BearerTokenRequest, @Res() response: Response) {
    const accessToken = request.token;
    if (!accessToken)
      throw new UnauthorizedException('Bearer Token is missing');

    await this.authService.logout(accessToken);

    return response
      .clearCookie('refreshToken', this.cookieOptions)
      .status(200)
      .send();
  }

  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const requestRefreshToken = request.cookies['refreshToken'];
    if (!requestRefreshToken) {
      throw new UnauthorizedException('Refresh Token is missing');
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshAccessTokenAndRefreshToken(
        requestRefreshToken,
      );

    return response
      .status(201)
      .cookie('refreshToken', refreshToken, this.cookieOptions)
      .send({ accessToken });
  }

  @Get('/github/username')
  async getGithubUsername(@Req() request: BearerTokenRequest) {
    const tempIdToken = request.token;
    if (!tempIdToken)
      throw new UnauthorizedException('Bearer Token is missing');

    const githubUsername =
      await this.authService.getGithubUsernameByTempIdToken(tempIdToken);

    return { githubUsername };
  }
}
