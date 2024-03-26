import { authAPI, checkAccessToken, setAccessToken } from "../../apis/utils/authAPI";
import { API_URL } from "../../constants/path";
import { RefreshDTO } from "../../types/authDTO";

const checkAuthentication = async (): Promise<boolean | unknown> => {
  if (checkAccessToken()) return true;

  try {
    const response = await authAPI.post<RefreshDTO>(API_URL.REFRESH);
    setAccessToken(response.data.accessToken);
    return true;
  } catch (error) {
    return error;
  }
};

export default checkAuthentication;
