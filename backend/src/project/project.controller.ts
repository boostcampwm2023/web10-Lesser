import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { projectFixtures } from 'fixtures/project-fixtures';
import { BearerTokenRequest } from 'src/common/middleware/parse-bearer-token.middleware';

import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly lesserJwtService: LesserJwtService) {}
  @Get('/')
  async getProjectList(@Req() request: BearerTokenRequest) {
    const accessToken = request.token;
    if (!accessToken)
      throw new UnauthorizedException('Bearer Token is missing');

    // access token 검증을 위한 임시 로직
    await this.lesserJwtService.getPayload(accessToken, 'access');

    return { projects: projectFixtures };
  }
}
