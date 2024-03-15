import { IsNotEmpty, IsString } from 'class-validator';

export class GithubAuthenticationRequestDto {
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
