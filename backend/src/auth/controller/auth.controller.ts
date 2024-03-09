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
import { AuthService } from '../service/auth.service';
import { CookieOptions, Response, Request } from 'express';

interface CustomHeaders {
  authorization: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false, // HTTPS 적용시 true로 변경
    path: '/api/auth/',
    sameSite: 'strict',
  };

  @Get('github/authorization-server')
  getGithubAuthServerUrl() {
    return { authUrl: this.authService.getGithubAuthUrl() };
  }

  @Post('github/authentication')
  async githubAuthentication(
    @Body() body: { authCode: string },
    @Res() response: Response,
  ) {
    try {
      const result = await this.authService.githubAuthentication(body.authCode);
      if ('tempIdToken' in result) {
        const responseBody = { tempIdToken: result.tempIdToken };
        return response.status(209).send(responseBody);
      } else {
        const responseBody = { accessToken: result.accessToken };
        return response
          .status(201)
          .cookie('refreshToken', result.refreshToken, this.cookieOptions)
          .send(responseBody);
      }
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
    @Req() request: Request & { headers: CustomHeaders },
    @Body() body: { username: string; position: string; techStack: string[] },
    @Res() response: Response,
  ) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [bearer, tempIdToken] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !tempIdToken) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const { accessToken, refreshToken } = await this.authService.githubSignup(
        tempIdToken,
        body.username,
        body.position,
        { stacks: body.techStack },
      );
      const responseBody = { accessToken };
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
  async logout(
    @Req() request: Request & { headers: CustomHeaders },
    @Res() response: Response,
  ) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [bearer, accessToken] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

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
}
