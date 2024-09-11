import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class ProjectInfo {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256, { message: 'Title is too long' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256, { message: 'Subject is too long' })
  subject: string;
}

export class ProjectInfoUpdateRequestDto {
  @Matches(/^update$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProjectInfo)
  content: ProjectInfo;
}
