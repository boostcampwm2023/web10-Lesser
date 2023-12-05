import { PickType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
