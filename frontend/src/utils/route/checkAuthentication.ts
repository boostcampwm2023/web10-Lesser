import { postRefresh } from "../../apis/api/loginAPI";
import { checkAccessToken } from "../../apis/utils/authAPI";

const checkAuthentication = async (): Promise<boolean | unknown> => {
  if (checkAccessToken()) return true;
  try {
    await postRefresh();
    return true;
  } catch (error) {
    return error;
  }
};

export default checkAuthentication;
