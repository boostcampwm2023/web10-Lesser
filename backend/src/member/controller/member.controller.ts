import { Controller, Get, Query } from '@nestjs/common';
import { MemberService } from '../service/member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
  @Get('/availability')
  async availabilityUsername(@Query('username') username) {
    try {
      await this.memberService.validateUsername(username);
      return { available: true };
    } catch (err) {
      return { available: false, message: err.message };
    }
  }
}
