import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CompleteSprintRequestDto, CreateSprintRequestDto, CreateSprintResponseDto } from './dto/Sprint.dto';
import { Member } from 'src/common/decorators/memberDecorator';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { IsLoginGuard } from 'src/common/auth/IsLogin.guard';

@UseGuards(IsLoginGuard)
@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  createSprint(
    @Member() memberInfo: memberDecoratorType,
    @Body() body: CreateSprintRequestDto,
  ): Promise<CreateSprintResponseDto> {
    return this.sprintsService.createSprint(body, memberInfo);
  }

  @Patch('/complete')
  async completeSprint(@Body() body: CompleteSprintRequestDto): Promise<Record<string, never>> {
    await this.sprintsService.completeSprint(body);
    return {};
  }
}
