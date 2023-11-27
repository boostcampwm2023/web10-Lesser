import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const REFRESH_TOKEN = 'refreshToken';

let accessToken: string | undefined;

const setAccessToken = (newAccessToken: string): void => {
  accessToken = newAccessToken;
};

const api = axios.create({
  baseURL: `https://lesser-project.site/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const requestSucceed = (response: AxiosResponse): AxiosResponse => response;

const requestFail = async (error: AxiosError) => {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
  const newError = refreshFail(error);

  // refreshToken이 없으면 다시 로그인
  if (!refreshToken) {
    return Promise.reject(newError);
  }

  // 액세스 토큰 만료 지남
  if (error.response?.status === 401 && (error.message === 'expired token' || refreshToken)) {
    try {
      accessToken = undefined;
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
      return Promise.reject(newError);
    }
  }

  if (error.status === 401) {
    accessToken = undefined;
    return Promise.reject(newError);
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

const refreshFail = (error: AxiosError) => {
  const newError = error;
  sessionStorage.removeItem(REFRESH_TOKEN);
  newError.status = 401;
  newError.message = '';

  return newError;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.withCredentials = true;
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(requestSucceed, requestFail);

export { api, setAccessToken };
