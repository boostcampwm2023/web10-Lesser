import { baseAPI } from "../utils";
import { API_URL, ROUTER_URL } from "../../constants/path";
import {
  AccessTokenResponse,
  AuthenticationDTO,
  GithubOauthUrlDTO,
  RefreshDTO,
  TempIdTokenResponse,
} from "../../types/DTO/authDTO";
import { useNavigate } from "react-router-dom";
import { authAPI, setAccessToken } from "../utils/authAPI";
import { SESSION_STORAGE_KEY } from "../../constants/storageKey";

export const getLoginURL = async () => {
  const response = await baseAPI.get<GithubOauthUrlDTO>(
    API_URL.GITHUB_OAUTH_URL
  );
  return response.data.authUrl;
};

export const postAuthCode = async (authCode: string) => {
  const navigate = useNavigate();
  const redirectURL = sessionStorage.getItem(SESSION_STORAGE_KEY.REDIRECT);
  const response = await baseAPI.post<AuthenticationDTO>(API_URL.AUTH, {
    authCode,
  });
  if (response.status === 201) {
    const body = response.data as AccessTokenResponse;
    setAccessToken(body.accessToken);
    window.localStorage.setItem("member", JSON.stringify(body.member));
    redirectURL
      ? navigate(redirectURL, { replace: true })
      : navigate(ROUTER_URL.PROJECTS);
    return;
  }
  if (response.status === 209) {
    const body = response.data as TempIdTokenResponse;
    navigate(ROUTER_URL.SIGNUP, {
      state: { tempIdToken: body.tempIdToken },
      replace: redirectURL ? true : false,
    });
    return;
  }
};

export const postLogout = async () => {
  const response = await authAPI.post(API_URL.LOG_OUT);

  if (response.status === 200) {
    setAccessToken(undefined);
    window.localStorage.clear();
    return response;
  }
};

export const postRefresh = async () => {
  const response = await authAPI.post<RefreshDTO>(API_URL.REFRESH);
  setAccessToken(response.data.accessToken);
};
