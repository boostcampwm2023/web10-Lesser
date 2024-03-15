import axios from "axios";
import { API_URL, BASE_URL } from "../../constants/path";

export const getNicknameAvailability = async (nickname: string) => {
  const response = await axios(BASE_URL + API_URL.NICKNAME_AVAILABLILITY, {
    params: { username: nickname },
  });
  return response.data.available;
};
