import { Socket } from 'socket.io';
import { Member } from 'src/member/entity/member.entity';
import { Project } from '../entity/project.entity';
import { MemberStatus } from '../enum/MemberStatus.enum';

export interface ClientSocket extends Socket {
  projectId?: number;
  project: Project;
  member: Member;
  status: MemberStatus;
}
