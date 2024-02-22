export class GithubUserDto {
  github_id: string;
  username: string;
  image_url: string;

  public static of(github_id: string, username: string, image_url: string) {
    const newGithubUser = new GithubUserDto();
    newGithubUser.github_id = github_id;
    newGithubUser.username = username;
    newGithubUser.image_url = image_url;
    return newGithubUser;
  }
}
