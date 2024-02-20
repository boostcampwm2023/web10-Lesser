import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('github/authorization-server')
  getGithubAuthServerUrl() {
    return { authUrl: this.authService.getGithubAuthUrl() };
  }
  @Post('github/authentication')
  async githubAuthentication(@Body() body: { authCode: string }) {
    try {
      const accessToken = await this.authService.getAccessToken(body.authCode);
    } catch {
      throw new UnauthorizedException();
    }

    // Todo: access token -> user infomation

    // Todo: if github user is not member, store user infomation in temp user table and return tempIdToken

    // Todo: if github user is member, login
  }
}
