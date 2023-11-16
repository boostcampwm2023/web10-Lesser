import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { createBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { createBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { BacklogsService } from './backlogs.service';

@Controller('backlogs')
export class BacklogsController {
  constructor(private readonly backlogsService: BacklogsService) {}

  @Post('Epic')
  async createEpic(@Body(new ValidationPipe()) body: createBacklogsEpicDto): Promise<Record<string, never>> {
    await this.backlogsService.createEpic(body);
    return {};
  }
  @Post('Story')
  async createStory(@Body(new ValidationPipe()) body: createBacklogsStoryDto): Promise<Record<string, never>> {
    await this.backlogsService.createStory(body);
    return {};
  }
}
