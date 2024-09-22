import { Injectable } from '@nestjs/common';
import { ClientSocket } from '../type/ClientSocket.type';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { getRecursiveErrorMsgList } from '../util/validation.util';
import { ProjectService } from '../service/project.service';
import { ProjectInfoUpdateRequestDto } from '../dto/project-info/ProjectInfoUpdateRequest.dto';
import { ProjectInfoUpdateNotifyDto } from '../dto/project-info/ProjectInfoUpdateNotify.dto';
import { ProjectDeleteRequestDto } from '../dto/project-info/ProjectDeleteRequest.dto';
import { ProjectDeleteNotifyDto } from '../dto/project-info/ProjectDeleteNotify.dto';

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

  async deleteProject(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(ProjectDeleteRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const isLeader = await this.projectService.isProjectLeader(
      client.project.id,
      client.member,
    );
    if (!isLeader) {
      client.disconnect();
      return;
    }
    client.nsp.emit('main', ProjectDeleteNotifyDto.of());
    //TODO: 프로젝트가 조회되지 않게 함
    await this.waitNSecond(1);
    const isDeleted = await this.projectService.deleteProject(
      client.project.id,
      client.member,
    );
    if (!isDeleted) throw new Error('Project Not Deleted');
    client.nsp.disconnectSockets(true);
  }

  private waitNSecond(N: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, N * 1000);
    });
  }
}
