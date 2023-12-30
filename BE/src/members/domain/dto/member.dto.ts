import { PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

class BaseMemberDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  githubId: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}

export class MemberSearchListDto extends PickType(BaseMemberDto, ['id', 'username', 'imageUrl']) {}
export class ProjectMemberDto extends PickType(BaseMemberDto, ['id', 'username', 'imageUrl']) {}