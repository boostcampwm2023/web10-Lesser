import { baseAPI } from "../utils";
import { API_URL, ROUTER_URL } from "../../constants/path";
import {
  AccessTokenResponse,
  AuthenticationDTO,
  GithubOauthUrlDTO,
  TempIdTokenResponse,
} from "../../types/authDTO";
import { useNavigate } from "react-router-dom";
import { authAPI, setAccessToken } from "../utils/authAPI";

export const getLoginURL = async () => {
  const response = await baseAPI.get<GithubOauthUrlDTO>(API_URL.GITHUB_OAUTH_URL);
  return response.data.authUrl;
};

export const postAuthCode = async (authCode: string) => {
  const navigate = useNavigate();
  const response = await baseAPI.post<AuthenticationDTO>(API_URL.AUTH, {
    authCode,
  });
  if (response.status === 201) {
    const body = response.data as AccessTokenResponse;
    setAccessToken(body.accessToken);
    window.localStorage.setItem("member", JSON.stringify(body.member));
    navigate(ROUTER_URL.PROJECTS);
    return;
  }
  if (response.status === 209) {
    const body = response.data as TempIdTokenResponse;
    navigate(ROUTER_URL.SIGNUP, { state: { tempIdToken: body.tempIdToken } });
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
