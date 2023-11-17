import { Body, Controller, Delete, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateBacklogsEpicResponseDto } from 'src/dto/create-backlogs-epic-response.dto';
import { CreateBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { CreateBacklogsStoryResponseDto } from 'src/dto/create-backlogs-story-response.dto';
import { CreateBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { CreateBacklogsTaskResponseDto } from 'src/dto/create-backlogs-task-response.dto';
import { CreateBacklogsTaskDto } from 'src/dto/create-backlogs-task.dto';
import { DeleteBacklogsEpicDto } from 'src/dto/delete-backlogs-epic.dto';
import { DeleteBacklogsStoryDto } from 'src/dto/delete-backlogs-story.dto';
import { DeleteBacklogsTaskDto } from 'src/dto/delete-backlogs-task.dto';
import { UpdateBacklogsEpicDto } from 'src/dto/update-backlogs-epic.dto';
import { UpdateBacklogsStoryDto } from 'src/dto/update-backlogs-story.dto';
import { UpdateBacklogsTaskDto } from 'src/dto/update-backlogs-task.dto';
import { BacklogsService } from './backlogs.service';

@Controller('backlogs')
@UsePipes(ValidationPipe)
export class BacklogsController {
  constructor(private readonly backlogsService: BacklogsService) {}

  @Post('Epic')
  async createEpic(@Body() body: CreateBacklogsEpicDto): Promise<CreateBacklogsEpicResponseDto> {
    return this.backlogsService.createEpic(body);
  }

  @Put('Epic')
  async updateEpic(@Body() body: UpdateBacklogsEpicDto): Promise<Record<string, never>> {
    await this.backlogsService.updateEpic(body);
    return {};
  }

  @Delete('Epic')
  async DeleteEpic(@Body() body: DeleteBacklogsEpicDto): Promise<Record<string, never>> {
    await this.backlogsService.deleteEpic(body);
    return {};
  }

  @Post('Story')
  async createStory(@Body() body: CreateBacklogsStoryDto): Promise<CreateBacklogsStoryResponseDto> {
    return this.backlogsService.createStory(body);
  }

  @Put('Story')
  async updateStory(@Body() body: UpdateBacklogsStoryDto): Promise<Record<string, never>> {
    await this.backlogsService.updateStory(body);
    return {};
  }

  @Delete('Story')
  async DeleteStory(@Body() body: DeleteBacklogsStoryDto): Promise<Record<string, never>> {
    await this.backlogsService.deleteStory(body);
    return {};
  }

  @Post('Task')
  async createTask(@Body() body: CreateBacklogsTaskDto): Promise<CreateBacklogsTaskResponseDto> {
    return this.backlogsService.createTask(body);
  }

  @Put('Task')
  async updateTask(@Body() body: UpdateBacklogsTaskDto): Promise<Record<string, never>> {
    await this.backlogsService.updateTask(body);
    return {};
  }

  @Delete('Task')
  async DeleteTask(@Body() body: DeleteBacklogsTaskDto): Promise<Record<string, never>> {
    await this.backlogsService.deleteTask(body);
    return {};
  }
}
