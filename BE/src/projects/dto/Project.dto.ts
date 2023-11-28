import { PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}

export class CreateProjectRequestDto extends PickType(BaseProjectDto, ['name', 'subject']) {}
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
