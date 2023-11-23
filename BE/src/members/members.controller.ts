import { Body, Controller, Post } from '@nestjs/common';
import { MembersService } from './members.service';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('login')
  login(@Body() body: LoginRequestDto) {
    return this.membersService.githubLogin(body);
  }
}
