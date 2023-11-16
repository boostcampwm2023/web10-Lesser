import { Body, Controller, Delete, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { CreateBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { CreateBacklogsTaskDto } from 'src/dto/create-backlogs-task.dto';
import { DeleteBacklogsEpicDto } from 'src/dto/delete-backlogs-epic.dto';
import { DeleteBacklogsStoryDto } from 'src/dto/delete-backlogs-story.dto';
import { UpdateBacklogsEpicDto } from 'src/dto/update-backlogs-epic.dto';
import { UpdateBacklogsStoryDto } from 'src/dto/update-backlogs-story.dto';
import { BacklogsService } from './backlogs.service';

@Controller('backlogs')
@UsePipes(ValidationPipe)
export class BacklogsController {
  constructor(private readonly backlogsService: BacklogsService) {}

  @Post('Epic')
  async createEpic(@Body() body: CreateBacklogsEpicDto): Promise<Record<string, never>> {
    await this.backlogsService.createEpic(body);
    return {};
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
  async createStory(@Body() body: CreateBacklogsStoryDto): Promise<Record<string, never>> {
    await this.backlogsService.createStory(body);
    return {};
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
  async createTask(@Body() body: CreateBacklogsTaskDto) {
    await this.backlogsService.createTask(body);
    return {};
  }
}
