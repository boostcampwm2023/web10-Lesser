import { Body, Controller, Delete, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { createBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { createBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { createBacklogsTaskDto } from 'src/dto/create-backlogs-task.dto';
import { deleteBacklogsEpicDto } from 'src/dto/delete-backlogs-epic.dto';
import { updateBacklogsEpicDto } from 'src/dto/update-backlogs-epic.dto';
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

  @Put('Epic')
  async updateEpic(@Body() body: updateBacklogsEpicDto): Promise<Record<string, never>> {
    await this.backlogsService.updateEpic(body);
    return {};
  }

  @Delete('Epic')
  async DeleteEpic(@Body() body: deleteBacklogsEpicDto): Promise<Record<string, never>> {
    await this.backlogsService.deleteEpic(body);
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
