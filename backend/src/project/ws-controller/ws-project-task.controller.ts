import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TaskCreateNotifyDto } from '../dto/task/TaskCreateNotify.dto';
import { TaskCreateRequestDto } from '../dto/task/TaskCreateRequest.dto';
import { TaskDeleteNotifyDto } from '../dto/task/TaskDeleteNotify.dto';
import { TaskDeleteRequestDto } from '../dto/task/TaskDeleteRequest.dto';
import { TaskUpdateNotifyDto } from '../dto/task/TaskUpdateNotify.dto';
import { TaskUpdateRequestDto } from '../dto/task/TaskUpdateRequest.dto';
import { ProjectService } from '../service/project.service';
import { ClientSocket } from '../type/ClientSocket.type';
import { getRecursiveErrorMsgList } from '../util/validation.util';

@Injectable()
export class WsProjectTaskController {
  constructor(private readonly projectService: ProjectService) {}
  async createTask(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(TaskCreateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }

    const { content } = data as TaskCreateRequestDto;
    const createdTask = await this.projectService.createTask(
      client.project,
      content.title,
      content.expectedTime,
      content.actualTime,
      content.status,
      content.assignedMemberId,
      content.storyId,
    );
    client.nsp
      .to('backlog')
      .emit('backlog', TaskCreateNotifyDto.of(createdTask));
  }

  async deleteTask(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(TaskDeleteRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as TaskDeleteRequestDto;
    const isDeleted = await this.projectService.deleteTask(
      client.project,
      content.id,
    );
    if (isDeleted) {
      client.nsp
        .to('backlog')
        .emit('backlog', TaskDeleteNotifyDto.of(content.id));
    }
  }

  async updateTask(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(TaskUpdateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as TaskUpdateRequestDto;
    const isUpdated = await this.projectService.updateTask(
      client.project,
      content.id,
      content.storyId,
      content.title,
      content.expectedTime,
      content.actualTime,
      content.status,
      content.assignedMemberId,
    );

    if (isUpdated) {
      client.nsp
        .to('backlog')
        .emit(
          'backlog',
          TaskUpdateNotifyDto.of(
            content.id,
            content.storyId,
            content.title,
            content.expectedTime,
            content.actualTime,
            content.status,
            content.assignedMemberId,
          ),
        );
    }
  }
}
