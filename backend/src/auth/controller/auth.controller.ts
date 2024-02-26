import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
		console.log(responseBody);
        return response.status(209).send(responseBody);
      } else {
        const responseBody = { accessToken: result.accessToken };
        return response
          .status(201)
          .cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: false, // HTTPS 적용시 true로 변경
            path: '/',
            sameSite: 'strict',
          })
          .send(responseBody);
      }
    } catch (err) {
      if (
        err.message === 'Cannot retrieve access token' ||
        err.message === 'Cannot retrieve github user'
      ) {
        throw new UnauthorizedException();
      }
      throw new InternalServerErrorException();
    }
  }
}
