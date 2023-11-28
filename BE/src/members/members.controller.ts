import { Body, Controller, Header, Post, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LesserJwtService } from 'src/common/lesser-jwt/lesser-jwt.service';

interface CustomHeaders {
  authorization: string;
}

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly lesserJwtService: LesserJwtService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginRequestDto) {
    const tokens = await this.membersService.githubLogin(body);
    return tokens;
  }

  @Post('logout')
  async logout(@Req() request: Request & { headers: CustomHeaders }) {
    const { authorization } = request.headers;
    const token = authorization.split('Bearer ')[1];
    this.lesserJwtService.veifryToken(token);
    const userId = await this.lesserJwtService.getUserId(token);
    this.membersService.logout(userId);
  }

  @Post('refresh')
  async generateAccessToken(@Req() request: Request & { headers: CustomHeaders }) {
    const { authorization } = request.headers;
    const token = authorization.split('Bearer ')[1];
    this.lesserJwtService.veifryToken(token);
    const tokens = await this.membersService.refresh(token);
    return tokens;
  }
}
