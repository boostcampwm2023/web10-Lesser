export type GithubOauthUrlDTO = { authUrl: string };

export interface AccessTokenResponse {
  accessToken: string;
}
export interface TempIdTokenResponse {
  tempIdToken: string;
}
export type AuthenticationDTO = AccessTokenResponse | TempIdTokenResponse;