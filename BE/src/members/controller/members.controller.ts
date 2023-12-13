import { Body, Controller, Get, Header, Post, Query, Req } from '@nestjs/common';
import { MembersService } from '../domain/service/members.service';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
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
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await this.membersService.githubLogin(body);
    return response;
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
  async refreshTokens(@Req() request: Request & { headers: CustomHeaders }) {
    const { authorization } = request.headers;
    const token = authorization.split('Bearer ')[1];
    this.lesserJwtService.veifryToken(token);
    const tokens = await this.membersService.refresh(token);
    return tokens;
  }

  @Get('search')
  async searchMembersByName(@Query('username') username: string) {
    return this.membersService.searchMembersByName(username);
  }
}
