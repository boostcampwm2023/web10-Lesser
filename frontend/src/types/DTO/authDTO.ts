export type GithubOauthUrlDTO = { authUrl: string };

export interface memberResponse {
  username: string;
  imageUrl: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  member: memberResponse;
}

export interface TempIdTokenResponse {
  tempIdToken: string;
}

export type AuthenticationDTO = AccessTokenResponse | TempIdTokenResponse;

export interface SignupDTO {
  username: string;
  position: null | string;
  techStack: null | string[];
}

export interface RefreshDTO {
  accessToken: string;
}
