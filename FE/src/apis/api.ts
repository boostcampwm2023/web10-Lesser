import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { REFRESH_TOKEN } from '../constants/constants';

let accessToken: string | undefined;

const setAccessToken = (newAccessToken: string | undefined): void => {
  accessToken = newAccessToken;
};

const isAccessTokenExisting = () => !!accessToken;
const isRefreshTokenExisting = () => {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);

  return !!refreshToken;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_NEST_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const requestSucceed = (response: AxiosResponse): AxiosResponse => response;

const requestFail = async (error: AxiosError) => {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);

  // refreshToken이 없으면 다시 로그인
  if (!refreshToken) {
    error.status = 401;
    error.message = '';

    return Promise.reject(error);
  }

  // 액세스 토큰 만료 지남
  if (error.response?.status === 401 && (error.message === 'expired token' || refreshToken)) {
    accessToken = undefined;

    try {
      const response = await api.post(
        '/members/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      return await refreshSucceed(response, error.config);
    } catch {
      error.status = 401;
      error.message = '';
      sessionStorage.removeItem(REFRESH_TOKEN);

      return Promise.reject(error);
    }
  }

  if (error.status === 401) {
    accessToken = undefined;
    sessionStorage.removeItem(REFRESH_TOKEN);
    error.status = 401;
    error.message = '';

    return Promise.reject(error);
  }

  return Promise.reject(error);
};

const refreshSucceed = async (response: AxiosResponse, config: InternalAxiosRequestConfig | undefined) => {
  // 토큰 재설정
  const newAccessToken = response.data.accessToken;
  const newRefreshToken = response.data.refreshToken;
  accessToken = newAccessToken;
  sessionStorage.setItem(REFRESH_TOKEN, newRefreshToken);

  // 토큰을 새로 담아 재요청
  if (config) {
    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
    const newResponse = await api(config);

    return newResponse;
  }
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.withCredentials = true;
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(requestSucceed, requestFail);

export { api, setAccessToken, isAccessTokenExisting, isRefreshTokenExisting };
