import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { StoryCreateNotifyDto } from '../dto/story/StoryCreateNotify.dto';
import { StoryCreateRequestDto } from '../dto/story/StoryCreateRequest.dto';
import { StoryDeleteNotifyDto } from '../dto/story/StoryDeleteNotify.dto';
import { StoryDeleteRequestDto } from '../dto/story/StoryDeleteRequest.dto';
import { StoryUpdateNotifyDto } from '../dto/story/StoryUpdateNotify.dto';
import { StoryUpdateRequestDto } from '../dto/story/StoryUpdateRequest.dto';
import { ProjectService } from '../service/project.service';
import { ClientSocket } from '../type/ClientSocket.type';
import { getRecursiveErrorMsgList } from '../util/validation.util';

@Injectable()
export class WsProjectStoryController {
  constructor(private readonly projectService: ProjectService) {}
  async createStory(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(StoryCreateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as StoryCreateRequestDto;
    const createdStory = await this.projectService.createStory(
      client.project,
      content.epicId,
      content.title,
      content.point,
      content.status,
      content.rankValue,
    );
    client.nsp
      .to('backlog')
      .emit('backlog', StoryCreateNotifyDto.of(createdStory));
  }

  async deleteStory(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(StoryDeleteRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as StoryDeleteRequestDto;
    const isDeleted = await this.projectService.deleteStory(
      client.project,
      content.id,
    );
    if (isDeleted) {
      client.nsp
        .to('backlog')
        .emit('backlog', StoryDeleteNotifyDto.of(content.id));
    }
  }

  async updateStory(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(StoryUpdateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as StoryUpdateRequestDto;
    const { isUpdated, updatedRankValue } =
      await this.projectService.updateStory(
        client.project,
        content.id,
        content.epicId,
        content.title,
        content.point,
        content.status,
        content.rankValue,
      );

    if (isUpdated) {
      client.nsp
        .to('backlog')
        .emit(
          'backlog',
          StoryUpdateNotifyDto.of(
            content.id,
            content.epicId,
            content.title,
            content.point,
            content.status,
            updatedRankValue,
          ),
        );
    }
  }
}
