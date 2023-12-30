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

  public static of(github_id: string, username: string, email: string, image_url: string) {
    const newGithubUser = new GithubUser();
    newGithubUser.github_id = github_id;
    newGithubUser.username = username;
    newGithubUser.email = email;
    newGithubUser.image_url = image_url;
    return newGithubUser;
  }

  public setEmail(email: string) {
    this.email = email;
  }
}

export interface GithubEmail {
  primary: boolean;
  email: string;
}
