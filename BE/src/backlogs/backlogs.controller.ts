import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { createBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { createBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { createBacklogsTaskDto } from 'src/dto/create-backlogs-task.dto';
import { BacklogsService } from './backlogs.service';

@Controller('backlogs')
@UsePipes(ValidationPipe)
export class BacklogsController {
  constructor(private readonly backlogsService: BacklogsService) {}

  @Post('Epic')
  async createEpic(@Body() body: createBacklogsEpicDto): Promise<Record<string, never>> {
    await this.backlogsService.createEpic(body);
    return {};
  }
  @Post('Story')
  async createStory(@Body() body: createBacklogsStoryDto): Promise<Record<string, never>> {
    await this.backlogsService.createStory(body);
    return {};
  }

  @Post('Task')
  async createTask(@Body() body: createBacklogsTaskDto) {
    await this.backlogsService.createTask(body);
    return {};
  }
}
