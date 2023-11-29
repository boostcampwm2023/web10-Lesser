import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CreateSprintRequestDto, CreateSprintResponseDto } from './dto/Sprint.dto';
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
}
