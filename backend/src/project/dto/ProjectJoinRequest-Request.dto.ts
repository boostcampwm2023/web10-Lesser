import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProjectJoinRequestRequestDto {
  @IsNotEmpty()
  @IsUUID(4, { message: 'not uuid' })
  inviteLinkId: string;
}
