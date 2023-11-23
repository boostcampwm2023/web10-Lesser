import { PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

class BaseProjectDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateProjectRequestDto extends PickType(BaseProjectDto, ['name']) {}
export class CreateProjectResponseDto extends PickType(BaseProjectDto, ['id']) {}

export class ReadProjectListResponseDto extends BaseProjectDto {
  nextPage: string;
}
