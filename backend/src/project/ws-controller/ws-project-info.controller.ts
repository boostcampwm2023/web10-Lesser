import { Injectable } from '@nestjs/common';
import { ClientSocket } from '../type/ClientSocket.type';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { getRecursiveErrorMsgList } from '../util/validation.util';
import { ProjectService } from '../service/project.service';
import { ProjectInfoUpdateRequestDto } from '../dto/project-info/ProjectInfoUpdateRequest.dto';
import { ProjectInfoUpdateNotifyDto } from '../dto/project-info/ProjectInfoUpdateNotify.dto';

@Injectable()
export class WsProjectInfoController {
  constructor(private readonly projectService: ProjectService) {}
  async updateProjectInfo(client: ClientSocket, data: any) {
    const errors = await validate(
      plainToClass(ProjectInfoUpdateRequestDto, data),
    );
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    try {
      const { content } = data as ProjectInfoUpdateRequestDto;
      const isUpdate = await this.projectService.updateProjectInfo(
        client.project,
        client.member,
        content.title,
        content.subject,
      );
      if (isUpdate) {
        const data = ProjectInfoUpdateNotifyDto.of(
          content.title,
          content.subject,
        );
        client.nsp.to('landing').emit('landing', data);
        client.nsp.to('setting').emit('setting', data);
      }
    } catch (e) {
      if (e.message === 'Member is not the project leader') {
        client.disconnect(true);
      } else throw e;
    }
  }
}
