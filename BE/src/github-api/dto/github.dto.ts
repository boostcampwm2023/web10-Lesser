import { IsNotEmpty, IsString } from 'class-validator';

export class GithubUser {
  @IsString()
  @IsNotEmpty()
  github_id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;
}

export interface GithubEmail {
  primary: boolean;
  email: string;
}
