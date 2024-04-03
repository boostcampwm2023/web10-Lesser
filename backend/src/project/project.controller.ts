import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { projectFixtures } from 'fixtures/project-fixtures';
import { BearerTokenRequest } from 'src/common/middleware/parse-bearer-token.middleware';
import { LesserJwtService } from 'src/lesser-jwt/lesser-jwt.service';
import { MemberRepository } from 'src/member/repository/member.repository';
import { ProjectService } from './service/project.service';
import { CreateProjectRequestDto } from './dto/CreateProjectRequest.dto';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly lesserJwtService: LesserJwtService,
    private readonly projectService: ProjectService,
    private readonly memberRepository: MemberRepository,
  ) {}
  @Get('/')
  async getProjectList(@Req() request: BearerTokenRequest) {
    const accessToken = request.token;
    if (!accessToken)
      throw new UnauthorizedException('Bearer Token is missing');

    // access token 검증을 위한 임시 로직
    await this.lesserJwtService.getPayload(accessToken, 'access');

    return { projects: projectFixtures };
  }

  @Post('/')
  async createProject(
    @Req() request: BearerTokenRequest,
    @Body() body: CreateProjectRequestDto,
  ) {
    const accessToken = request.token;
    if (!accessToken)
      throw new UnauthorizedException('Bearer Token is missing');

    const {
      sub: { id },
    } = await this.lesserJwtService.getPayload(accessToken, 'access');
    const member = await this.memberRepository.findById(id);
    if (!member) throw new Error('assert: member must be found from database');

    await this.projectService.createProject(member, body.title, body.subject);
    return;
  }
}
