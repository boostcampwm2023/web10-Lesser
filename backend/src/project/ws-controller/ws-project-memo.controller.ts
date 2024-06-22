import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MemberService } from 'src/member/service/member.service';
import { MemoColorUpdateNotifyDto } from '../dto/memo/MemoColorUpdateNotify.dto';
import { MemoColorUpdateRequestDto } from '../dto/memo/MemoColorUpdateRequest.dto';
import { MemoCreateNotifyDto } from '../dto/memo/MemoCreateNotify.dto';
import { MemoCreateRequestDto } from '../dto/memo/MemoCreateRequest.dto';
import { MemoDeleteNotifyDto } from '../dto/memo/MemoDeleteNotify.dto';
import { MemoDeleteRequestDto } from '../dto/memo/MemoDeleteRequest.dto';
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
    client.nsp
      .to('landing')
      .emit('landing', MemoCreateNotifyDto.of(createdMemo, username));
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
      client.nsp
        .to('landing')
        .emit('landing', MemoDeleteNotifyDto.of(content.id));
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
      client.nsp
        .to('landing')
        .emit(
          'landing',
          MemoColorUpdateNotifyDto.of(content.id, content.color),
        );
    }
  }
}
