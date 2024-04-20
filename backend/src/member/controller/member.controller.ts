import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Public,
} from 'src/common/guard/authentication.guard';
import { BearerTokenRequest } from 'src/common/middleware/parse-bearer-token.middleware';
import { MemberService } from '../service/member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Public()
  @Get('/availability')
  async getUsernameAvailability(@Query('username') username: string) {
    if (!username) throw new BadRequestException('username is missing');
    try {
      await this.memberService.validateUsername(username);
      return { available: true };
    } catch (err) {
      if (err.message === 'duplicate username')
        return { available: false, message: err.message };
    }
  }

  @Get('/')
  async getMember(@Req() request: BearerTokenRequest) {
    const accessToken = request.token;
    if (!accessToken)
      throw new UnauthorizedException('Bearer Token is missing');

    const { username, githubImageUrl } =
      await this.memberService.getMemberPublicInfo(accessToken);
    return { username, imageUrl: githubImageUrl };
  }
}
