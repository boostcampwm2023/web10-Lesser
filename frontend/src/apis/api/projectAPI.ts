import { API_URL } from "../../constants/path";
import { authAPI } from "../utils/authAPI";

export const getProjects = async () => {
  const response = await authAPI.get(API_URL.PROJECT);

  if (response.status === 200) {
    return response.data.projects;
  }
};

export const postCreateProject = async (body: {
  title: string;
  subject: string;
}) => {
  const response = await authAPI.post(API_URL.PROJECT, body);
  return response.data;
};

export const postJoinProject = async (inviteLinkId: string) => {
  const response = await authAPI.post(API_URL.PROJECT_JOIN, { inviteLinkId });

  return response;
};
