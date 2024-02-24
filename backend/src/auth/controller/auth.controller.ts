import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
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
      const result = await this.authService.githubAuthentication(body.authCode);
      if ('tempIdToken' in result) {
        return { tempIdToken: result.tempIdToken };
      } else {
        // Todo: return access token, refresh token (login)
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
