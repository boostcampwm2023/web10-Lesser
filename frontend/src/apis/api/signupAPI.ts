import { API_URL } from "../../constants/path";
import { baseAPI } from "../utils";
import { SignupDTO } from "../../types/DTO/authDTO";
import { setAccessToken } from "../utils/authAPI";

interface SignupParams extends SignupDTO {
  tempIdToken: string;
}

export const getNicknameAvailability = async (nickname: string) => {
  const response = await baseAPI.get(API_URL.NICKNAME_AVAILABLILITY, {
    withCredentials: false,
    params: { username: nickname },
  });
  return response.data.available;
};

export const getGithubUsername = async (tempIdToken: string) => {
  const response = await baseAPI(API_URL.GITHUB_USERNAME, {
    headers: { Authorization: `Bearer ${tempIdToken}` },
  });

  if (response.status === 200) {
    return response.data.githubUsername;
  }
};

export const postSignup = async ({ tempIdToken, username, position, techStack }: SignupParams) => {
  const response = await baseAPI(API_URL.SIGN_UP, {
    method: "post",
    data: { username, position, techStack },
    headers: { Authorization: `Bearer ${tempIdToken}` },
  });

  if (response.status === 201) {
    setAccessToken(response.data.accessToken);
  }

  return response.status;
};
