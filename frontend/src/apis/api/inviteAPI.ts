import { API_URL } from "../../constants/path";
import { authAPI } from "../utils/authAPI";

export const getInvitePreview = async (inviteLinkId: string) => {
  const response = await authAPI.get(
    `${API_URL.INVITE_PREVIEW}/${inviteLinkId}`
  );

  return response;
};
