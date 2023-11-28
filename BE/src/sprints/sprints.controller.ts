import { Body, Controller, Post } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CreateSprintRequestDto } from './dto/Sprint.dto';

@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  createSprint(@Body() body: CreateSprintRequestDto) {
    return this.sprintsService.createSprint(body);
  }
}
