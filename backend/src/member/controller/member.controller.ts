import {
  Controller,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomHeaders } from 'src/auth/controller/auth.controller';
import { MemberService } from '../service/member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
  @Get('/availability')
  async getUsernameAvailability(@Query('username') username: string) {
    if (!username) throw new BadRequestException('username is missing');
    try {
      await this.memberService.validateUsername(username);
      return { available: true };
    } catch (err) {
      if (err.message === 'duplicate username')
        return { available: false, message: err.message };
      throw new InternalServerErrorException(err.message);
    }
  }
  @Get('/')
  async getMember(@Req() request: Request & { headers: CustomHeaders }) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [bearer, accessToken] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Invalid authorization header format');
    }
    try {
      const { username, githubImageUrl } =
        await this.memberService.getMemberPublicInfo(accessToken);
      return { username, imageUrl: githubImageUrl };
    } catch (err) {
      if (err.message === 'Failed to verify token')
        throw new UnauthorizedException('Expired:accessToken');
      throw new InternalServerErrorException(err.message);
    }
  }
}
