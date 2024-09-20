import { IsNotEmpty, Matches } from 'class-validator';

export class InviteLinkUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  content: Record<string, any>;
}
