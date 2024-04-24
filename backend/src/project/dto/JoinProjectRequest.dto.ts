import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinProjectRequestDto {
  @IsNotEmpty()
  @IsUUID(4, {message: "not uuid"})
  inviteLinkId: string;
}
