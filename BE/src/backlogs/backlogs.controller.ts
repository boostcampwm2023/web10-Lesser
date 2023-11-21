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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BacklogsService } from './backlogs.service';
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

@Controller('backlogs')
@UsePipes(ValidationPipe)
export class BacklogsController {
  constructor(private readonly backlogsService: BacklogsService) {}

  @Get(':id')
  readBacklog(@Param('id', ParseIntPipe) id) {
    return this.backlogsService.readBacklog(id);
  }

  @Post('epic')
  async createEpic(@Body() body: CreateBacklogsEpicRequestDto): Promise<CreateBacklogsEpicResponseDto> {
    return this.backlogsService.createEpic(body);
  }

  @Put('epic')
  async updateEpic(@Body() body: UpdateBacklogsEpicRequestDto): Promise<Record<string, never>> {
    await this.backlogsService.updateEpic(body);
    return {};
  }

  @Delete('epic')
  async DeleteEpic(@Body() body: DeleteBacklogsEpicRequestDto): Promise<Record<string, never>> {
    await this.backlogsService.deleteEpic(body);
    return {};
  }

  @Post('story')
  async createStory(@Body() body: CreateBacklogsStoryRequestDto): Promise<CreateBacklogsStoryResponseDto> {
    return this.backlogsService.createStory(body);
  }

  @Put('story')
  async updateStory(@Body() body: UpdateBacklogsStoryRequestDto): Promise<Record<string, never>> {
    await this.backlogsService.updateStory(body);
    return {};
  }

  @Delete('story')
  async DeleteStory(@Body() body: DeleteBacklogsStoryRequestDto): Promise<Record<string, never>> {
    await this.backlogsService.deleteStory(body);
    return {};
  }

  @Post('task')
  async createTask(@Body() body: CreateBacklogsTaskRequestDto): Promise<CreateBacklogsTaskResponseDto> {
    return this.backlogsService.createTask(body);
  }

  @Patch('task')
  async updateTask(@Body() body: UpdateBacklogsRequestTaskDto): Promise<Record<string, never>> {
    await this.backlogsService.updateTask(body);
    return {};
  }

  @Delete('task')
  async DeleteTask(@Body() body: DeleteBacklogsTaskRequestDto): Promise<Record<string, never>> {
    await this.backlogsService.deleteTask(body);
    return {};
  }
}
