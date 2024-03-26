import {
	Body,
	Controller,
	Get,
	InternalServerErrorException,
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
		getGithubAuthServerUrl() {
			return { authUrl: this.authService.getGithubAuthUrl() };
		}
		
		@Post('github/authentication')
		async githubAuthentication(
			@Body() body: GithubAuthenticationRequestDto,
			@Res() response: Response,
			) {
				try {
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
      } else
        throw new Error('assert: unexpected authentication result returned');
    } catch (err) {
      if (
        err.message === 'Cannot retrieve access token' ||
        err.message === 'Cannot retrieve github user'
      ) {
        throw new UnauthorizedException('Invalid authorization code');
      }
      throw new InternalServerErrorException(err.message);
    }
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
    try {
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
    } catch (err) {
      if (
        err.message === 'Failed to verify token' ||
        err.message === 'tempIdToken does not match'
      ) {
        throw new UnauthorizedException('Expired:tempIdToken');
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @Post('logout')
  async logout(@Req() request: BearerTokenRequest, @Res() response: Response) {
    const accessToken = request.token;
    if (!accessToken)
      throw new UnauthorizedException('Bearer Token is missing');

    try {
      await this.authService.logout(accessToken);
    } catch (err) {
      if (err.message === 'Not a logged in member') {
        throw new UnauthorizedException('Not a logged in member');
      }
      if (err.message === 'Failed to verify token') {
        throw new UnauthorizedException('Expired:accessToken');
      }
      throw new InternalServerErrorException(err.message);
    }
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
    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshAccessTokenAndRefreshToken(
          requestRefreshToken,
        );
      return response
        .status(201)
        .cookie('refreshToken', refreshToken, this.cookieOptions)
        .send({ accessToken });
    } catch (err) {
      if (
        err.message === 'No matching refresh token' ||
        err.message === 'Failed to verify token'
      ) {
        throw new UnauthorizedException('Expired:refreshToken');
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get('/github/username')
  async getGithubUsername(@Req() request: BearerTokenRequest) {
    const tempIdToken = request.token;
    if (!tempIdToken)
      throw new UnauthorizedException('Bearer Token is missing');
    try {
      const githubUsername =
        await this.authService.getGithubUsernameByTempIdToken(tempIdToken);
      return { githubUsername };
    } catch (err) {
      if (
        err.message === 'Failed to verify token' ||
        err.message === 'tempIdToken does not match'
      ) {
        throw new UnauthorizedException('Expired:tempIdToken');
      }
      throw new InternalServerErrorException(err.message);
    }
  }
}
