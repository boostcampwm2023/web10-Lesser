import { Body, Controller, Header, Post, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LesserJwtService } from 'src/common/lesser-jwt/lesser-jwt.service';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly lesserJwtService: LesserJwtService,
  ) {}

  @Post('login')
  login(@Body() body: LoginRequestDto) {
    return this.membersService.githubLogin(body);
  }

  @Post('refresh')
  async generateAccessToken(@Req() request: Request) {
    const headers: any = request.headers;
    const authorization = headers.authorization;
    const token = authorization.split('Bearer ')[1];
    this.lesserJwtService.veifryToken(token);
    const userId = -1;
    return {
      accessToken: await this.lesserJwtService.getAccessToken(userId),
      refreshToken: await this.lesserJwtService.getRefreshToken(),
    };
  }
}
