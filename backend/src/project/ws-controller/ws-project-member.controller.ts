import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MemberUpdateNotifyDto } from '../dto/member/MemberUpdateNotify.dto';
import { MemberUpdateRequestDto } from '../dto/member/MemberUpdateRequest.dto';
import { ClientSocket } from '../type/ClientSocket.type';
import { getRecursiveErrorMsgList } from '../util/validation.util';

@Injectable()
export class WsProjectMemberController {
  async updateMemberState(client: ClientSocket, data: any) {
    const errors = await validate(plainToClass(MemberUpdateRequestDto, data));
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }

    const status = data.content.status;
    if (status === client.status) return;
    client.status = status;

    const projectSocketList: ClientSocket[] =
      (await client.nsp.fetchSockets()) as unknown as ClientSocket[];
    projectSocketList.forEach((socket) => {
      if (socket.member.id === client.member.id) {
        socket.status = status;
      }
    });

    this.sendMemberStatusUpdate(client);
  }

  private sendMemberStatusUpdate(client: ClientSocket) {
    client.nsp
      .to('landing')
      .emit(
        'landing',
        MemberUpdateNotifyDto.of(client.member.id, client.status),
      );
  }
}
