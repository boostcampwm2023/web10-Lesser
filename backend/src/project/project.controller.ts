import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { projectFixtures } from 'fixtures/project-fixtures';

import { CustomHeaders } from 'src/auth/controller/auth.controller';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly lesserJwtService: LesserJwtService) {}
  @Get('/')
  async getProjectList(@Req() request: Request & { headers: CustomHeaders }) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [bearer, accessToken] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

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
