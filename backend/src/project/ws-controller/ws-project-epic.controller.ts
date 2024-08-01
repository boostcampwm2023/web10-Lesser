import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { EpicCreateNotifyDto } from '../dto/epic/EpicCreateNotify.dto';
import { EpicCreateRequestDto } from '../dto/epic/EpicCreateRequest.dto';
import { EpicDeleteNotifyDto } from '../dto/epic/EpicDeleteNotify.dto';
import { EpicDeleteRequestDto } from '../dto/epic/EpicDeleteRequest.dto';
import { EpicUpdateNotifyDto } from '../dto/epic/EpicUpdateNotify.dto';
import { EpicUpdateRequestDto } from '../dto/epic/EpicUpdateRequest.dto';
import { ProjectService } from '../service/project.service';
import { ClientSocket } from '../type/ClientSocket.type';
import { getRecursiveErrorMsgList } from '../util/validation.util';

@Injectable()
export class WsProjectEpicController {
  constructor(private readonly projectService: ProjectService) {}
  async createEpic(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(EpicCreateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as EpicCreateRequestDto;
    const createdEpic = await this.projectService.createEpic(
      client.project,
      content.name,
      content.color,
      content.rankValue,
    );
    client.nsp
      .to('backlog')
      .emit(
        'backlog',
        EpicCreateNotifyDto.of(
          createdEpic.id,
          createdEpic.name,
          createdEpic.color,
          createdEpic.rankValue,
        ),
      );
  }

  async deleteEpic(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(EpicDeleteRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as EpicDeleteRequestDto;
    const isDeleted = await this.projectService.deleteEpic(
      client.project,
      content.id,
    );
    if (isDeleted) {
      client.nsp
        .to('backlog')
        .emit('backlog', EpicDeleteNotifyDto.of(content.id));
    }
  }

  async updateEpic(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(EpicUpdateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as EpicUpdateRequestDto;
    const { isUpdated, updatedRankValue } =
      await this.projectService.updateEpic(
        client.project,
        content.id,
        content.name,
        content.color,
        content.rankValue,
      );

    if (isUpdated) {
      client.nsp
        .to('backlog')
        .emit(
          'backlog',
          EpicUpdateNotifyDto.of(
            content.id,
            content.name,
            content.color,
            updatedRankValue,
          ),
        );
    }
  }
}
