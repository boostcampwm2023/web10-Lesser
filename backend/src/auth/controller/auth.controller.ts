import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { GithubUserDto } from '../service/dto/github-user.dto';

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
      const githubUser: GithubUserDto =
        await this.authService.getGithubUser(accessToken);

      // Todo: check if github user is member

      // Done: if github user is not member, store user infomation in temp user table and return tempIdToken
      const tempIdToken = await this.authService.getTempIdToken(githubUser);
      return { tempIdToken };

      // Todo: if github user is member, login
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
