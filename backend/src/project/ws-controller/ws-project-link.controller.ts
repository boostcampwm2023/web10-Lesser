import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LinkCreateNotifyDto } from '../dto/link/LinkCreateNotify.dto';
import { LinkCreateRequestDto } from '../dto/link/LinkCreateRequest.dto';
import { LinkDeleteNotifyDto } from '../dto/link/LinkDeleteNotify.dto';
import { LinkDeleteRequestDto } from '../dto/link/LinkDeleteRequest.dto';
import { ProjectService } from '../service/project.service';
import { ClientSocket } from '../type/ClientSocket.type';
import { getRecursiveErrorMsgList } from '../util/validation.util';

@Injectable()
export class WsProjectLinkController {
  constructor(private readonly projectService: ProjectService) {}
  async createLink(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(LinkCreateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as LinkCreateRequestDto;
    const createLink = await this.projectService.createLink(
      client.project,
      content.url,
      content.description,
    );
    client.nsp
      .to('landing')
      .emit(
        'landing',
        LinkCreateNotifyDto.of(
          createLink.id,
          createLink.url,
          createLink.description,
        ),
      );
  }

  async deleteLink(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(LinkDeleteRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as LinkDeleteRequestDto;
    const isDeleted = await this.projectService.deleteLink(
      client.project,
      content.id,
    );
    if (isDeleted) {
      client.nsp
        .to('landing')
        .emit('landing', LinkDeleteNotifyDto.of(content.id));
    }
  }
}
