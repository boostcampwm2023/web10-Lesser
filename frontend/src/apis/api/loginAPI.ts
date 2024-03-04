import { baseAPI } from "../utils";
import { API_URL, ROUTER_URL } from "../../constants/path";
import { AuthenticatoinDTO, GithubOauthUrlDTO, TempIdTokenResponse } from "../../types/authDTO";
import { useNavigate } from "react-router-dom";

export const getLoginURL = async () => {
  const response = await baseAPI.get<GithubOauthUrlDTO>(API_URL.GITHUB_OAUTH_URL);
  return response.data.authUrl;
};

export const postAuthCode = async (authCode: string) => {
  const navitage = useNavigate();
  const response = await baseAPI.post<AuthenticatoinDTO>(API_URL.AUTH, { authCode });
  if (response.status === 201) {
    return;
  }
  if (response.status === 209) {
    const body = response.data as TempIdTokenResponse;
    navitage(ROUTER_URL.SIGNUP, { state: { tempIdToken: body.tempIdToken } });
    return;
  }
};
