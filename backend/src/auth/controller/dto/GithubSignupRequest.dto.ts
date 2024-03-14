import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GithubSignupRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  techStack: string[];
}
