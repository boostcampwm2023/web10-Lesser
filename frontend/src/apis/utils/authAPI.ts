import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_URL, BASE_URL } from "../../constants/path";
import { AccessTokenResponse } from "../../types/authDTO";

let accessToken: string | undefined;

const setAccessToken = (newAccessToken: string | undefined) => {
  accessToken = newAccessToken;
};

const checkAccessToken = (): boolean => {
  return !!accessToken;
};

const authAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  responseType: "json",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

authAPI.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

let unauthorizedErrorRetry = 0;

const successResponse = (response: AxiosResponse) => {
  unauthorizedErrorRetry = 0;
  return response;
};

const failResponse = async (error: AxiosError) => {
  if (error.status === 401 && error.message === "Expired:accessToken") {
    unauthorizedErrorRetry++;

    if (unauthorizedErrorRetry >= 3) {
      unauthorizedErrorRetry = 0;
      return Promise.reject(error);
    }

    try {
      const response = await authAPI.post<AccessTokenResponse>(API_URL.REFRESH);
      successRefresh(response.data.accessToken, error.config);
    } catch {
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
};

const successRefresh = async (
  newAccessToken: string,
  config: InternalAxiosRequestConfig | undefined
) => {
  setAccessToken(newAccessToken);

  if (config) {
    config.headers["Authorization"] = `Bearer ${newAccessToken}`;
    const newResponse = await authAPI(config);

    return newResponse;
  }
};

authAPI.interceptors.response.use(successResponse, failResponse);

export { authAPI, setAccessToken, checkAccessToken };
