import { PickType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProjectMemberDto } from 'src/members/dto/member.dto';

class BaseProjectDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  memberList: number[];
}

export class CreateProjectRequestDto extends PickType(BaseProjectDto, ['name', 'subject', 'memberList']) {}
export class CreateProjectResponseDto extends PickType(BaseProjectDto, ['id']) {}

export class ReadUserResponseDto {
  userId: number;
  userName: string;
}
export class ReadProjectListResponseDto extends BaseProjectDto {
  nextPage: string;
  myTaskCount: number;
  userList: ReadUserResponseDto[];
}

export class AddProjectMemberRequestDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsArray()
  @IsNotEmpty()
  memberList: number[];
}

export class AddProjectMemberResponseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsArray()
  @IsNotEmpty()
  memberList: ProjectMemberDto[];
}
