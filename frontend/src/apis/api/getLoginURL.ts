import { baseAPI } from "../utils";
import { PATH_URL } from "../../constants/path";

export const getLoginURL = async () => {
  const response = await baseAPI.get(PATH_URL.GITHUB_OAUTH_URL);
  return response.data;
};
