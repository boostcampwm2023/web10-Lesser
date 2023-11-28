import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IsLoginGuard } from 'src/common/auth/IsLogin.guard';
import { Member } from 'src/common/decorators/memberDecorator';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { BacklogsService } from './backlogs.service';
import { BacklogsAuthService } from './backlogsAuth.service';
import {
  CreateBacklogsEpicRequestDto,
  CreateBacklogsEpicResponseDto,
  DeleteBacklogsEpicRequestDto,
  UpdateBacklogsEpicRequestDto,
} from './dto/Epic.dto';
import {
  CreateBacklogsStoryRequestDto,
  CreateBacklogsStoryResponseDto,
  DeleteBacklogsStoryRequestDto,
  UpdateBacklogsStoryRequestDto,
} from './dto/Story.dto';
import {
  CreateBacklogsTaskRequestDto,
  CreateBacklogsTaskResponseDto,
  DeleteBacklogsTaskRequestDto,
  UpdateBacklogsRequestTaskDto,
} from './dto/Task.dto';

// @UseGuards(IsLoginGuard)
@Controller('backlogs')
@UsePipes(ValidationPipe)
export class BacklogsController {
  constructor(
    private readonly backlogsService: BacklogsService,
    private readonly backlogsAuthService: BacklogsAuthService,
  ) {}

  @Get(':id')
  async readBacklog(@Param('id', ParseIntPipe) id, @Member() memberInfo: memberDecoratorType) {
    // await this.backlogsAuthService.checkProjectAuth(id, memberInfo);
    return this.backlogsService.readBacklog(id);
  }

  @Post('epic')
  async createEpic(
    @Body() body: CreateBacklogsEpicRequestDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<CreateBacklogsEpicResponseDto> {
    // await this.backlogsAuthService.checkProjectAuth(body.projectId, memberInfo);
    return this.backlogsService.createEpic(body);
  }

  @Put('epic')
  async updateEpic(
    @Body() body: UpdateBacklogsEpicRequestDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<Record<string, never>> {
    // await this.backlogsAuthService.checkEpicAuth(body.id, memberInfo);
    await this.backlogsService.updateEpic(body);
    return {};
  }

  @Delete('epic')
  async DeleteEpic(
    @Body() body: DeleteBacklogsEpicRequestDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<Record<string, never>> {
    // await this.backlogsAuthService.checkEpicAuth(body.id, memberInfo);
    await this.backlogsService.deleteEpic(body);
    return {};
  }

  @Post('story')
  async createStory(
    @Body() body: CreateBacklogsStoryRequestDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<CreateBacklogsStoryResponseDto> {
    // await this.backlogsAuthService.checkEpicAuth(body.epicId, memberInfo);
    return this.backlogsService.createStory(body);
  }

  @Put('story')
  async updateStory(
    @Body() body: UpdateBacklogsStoryRequestDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<Record<string, never>> {
    // await this.backlogsAuthService.checkStoryAuth(body.id, memberInfo);
    await this.backlogsService.updateStory(body);
    return {};
  }

  @Delete('story')
  async DeleteStory(
    @Body() body: DeleteBacklogsStoryRequestDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<Record<string, never>> {
    // await this.backlogsAuthService.checkStoryAuth(body.id, memberInfo);
    await this.backlogsService.deleteStory(body);
    return {};
  }

  @Post('task')
  async createTask(
    @Body() body: CreateBacklogsTaskRequestDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<CreateBacklogsTaskResponseDto> {
    // await this.backlogsAuthService.checkStoryAuth(body.storyId, memberInfo);
    return this.backlogsService.createTask(body);
  }

  @Patch('task')
  async updateTask(
    @Body() body: UpdateBacklogsRequestTaskDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<Record<string, never>> {
    // await this.backlogsAuthService.checkTaskAuth(body.id, memberInfo);
    await this.backlogsService.updateTask(body);
    return {};
  }

  @Delete('task')
  async DeleteTask(
    @Body() body: DeleteBacklogsTaskRequestDto,
    @Member() memberInfo: memberDecoratorType,
  ): Promise<Record<string, never>> {
    // await this.backlogsAuthService.checkTaskAuth(body.id, memberInfo);
    await this.backlogsService.deleteTask(body);
    return {};
  }
}
