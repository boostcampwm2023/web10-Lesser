export class GithubUserDto {
  githubId: number;
  username: string;
  imageUrl: string;

  public static of(githubId: string, username: string, imageUrl: string) {
    const newGithubUser = new GithubUserDto();
    newGithubUser.githubId = +githubId;
    newGithubUser.username = username;
    newGithubUser.imageUrl = imageUrl;
    return newGithubUser;
  }
}
