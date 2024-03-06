export class GithubUserDto {
  githubId: number;
  githubUsername: string;
  githubImageUrl: string;

  public static of(githubId: string, username: string, imageUrl: string) {
    const newGithubUser = new GithubUserDto();
    newGithubUser.githubId = +githubId;
    newGithubUser.githubUsername = username;
    newGithubUser.githubImageUrl = imageUrl;
    return newGithubUser;
  }
}
