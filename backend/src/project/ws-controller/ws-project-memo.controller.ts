import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MemberService } from 'src/member/service/member.service';
import { MemoColorUpdateRequestDto } from '../dto/MemoColorUpdateRequest.dto';
import { MemoCreateRequestDto } from '../dto/MemoCreateRequest.dto';
import { MemoDeleteRequestDto } from '../dto/MemoDeleteRequest.dto';
import { ProjectService } from '../service/project.service';
import { ClientSocket } from '../type/ClientSocket.type';
import { getRecursiveErrorMsgList } from '../util/validation.util';

@Injectable()
export class WsProjectMemoController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly memberService: MemberService,
  ) {}
  async createMemo(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(MemoCreateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as MemoCreateRequestDto;
    const createdMemo = await this.projectService.createMemo(
      client.project,
      client.member,
      content.color,
    );
    const { username } = await this.memberService.getMember(client.member.id);
    client.nsp.to('landing').emit('landing', {
      domain: 'memo',
      action: 'create',
      content: {
        id: createdMemo.id,
        title: createdMemo.title,
        content: createdMemo.content,
        createdAt: createdMemo.created_at,
        author: username,
        color: createdMemo.color,
      },
    });
  }

  async deleteMemo(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(MemoDeleteRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as MemoDeleteRequestDto;
    const isDeleted = await this.projectService.deleteMemo(content.id);
    if (isDeleted) {
      client.nsp.to('landing').emit('landing', {
        domain: 'memo',
        action: 'delete',
        content: {
          id: content.id,
        },
      });
    }
  }

  async updateColor(client: ClientSocket, data: any) {
    const errors = await validate(
      plainToClass(MemoColorUpdateRequestDto, data),
    );
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    const { content } = data as MemoColorUpdateRequestDto;

    let isUpdated: boolean;
    try {
      isUpdated = await this.projectService.updateMemoColor(
        client.project,
        content.id,
        content.color,
      );
    } catch (error) {
      if (error.message === 'project does not have this memo') {
        //ToDo: 에러상황 정의 후 응답 구현
        return;
      }
    }

    if (isUpdated) {
      client.nsp.to('landing').emit('landing', {
        domain: 'memo',
        action: 'colorUpdate',
        content: {
          id: content.id,
          color: content.color,
        },
      });
    }
  }
}
