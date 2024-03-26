import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      // access token 검증을 위한 임시 로직
      await this.lesserJwtService.getPayload(accessToken, 'access');
    } catch (err) {
      if (err.message === 'Failed to verify token')
        throw new UnauthorizedException('Expired:accessToken');
      throw new InternalServerErrorException(err.message);
    }
    return { projects: projectFixtures };
  }
}
