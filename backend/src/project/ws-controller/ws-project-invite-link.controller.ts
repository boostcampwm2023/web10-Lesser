import { Injectable } from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { ClientSocket } from '../type/ClientSocket.type';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { getRecursiveErrorMsgList } from '../util/validation.util';
import { InviteLinkUpdateRequestDto } from '../dto/invite-link/InviteLinkUpdateRequest.dto';
import { InviteLinkUpdateResponseDto } from '../dto/invite-link/InviteLinkUpdateResponse.dto';

@Injectable()
export class WsProjectInviteLinkController {
  constructor(private readonly projectService: ProjectService) {}
  async updateInviteLink(client: ClientSocket, data: any) {
    const errors = await validate(
      plainToClass(InviteLinkUpdateRequestDto, data),
    );
    if (errors.length > 0) {
      const errorList = getRecursiveErrorMsgList(errors);
      client.emit('error', { errorList });
      return;
    }
    try {
      const newInviteLinkId = await this.projectService.updateInviteLink(
        client.project.id,
        client.member,
      );
      client.emit('landing', InviteLinkUpdateResponseDto.of(newInviteLinkId));
    } catch (e) {
      if (e.message === 'Member is not the project leader') {
        client.disconnect(true);
      } else throw e;
    }
  }
}
