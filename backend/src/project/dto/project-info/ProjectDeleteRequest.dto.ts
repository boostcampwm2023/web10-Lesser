import { IsNotEmpty, Matches } from 'class-validator';

export class ProjectDeleteRequestDto {
  @Matches(/^delete$/)
  action: string;

  @IsNotEmpty()
  content: Record<string, string>;
}
