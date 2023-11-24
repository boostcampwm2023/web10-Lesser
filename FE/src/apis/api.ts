import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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
  accessToken = undefined;
  const refreshToken = sessionStorage.getItem('refresh-token');
  const { status, config, message } = error;
  const newError = refreshFail(error);

  // refreshToken이 없으면 다시 로그인
  if (!refreshToken) {
    return Promise.reject(newError);
  }

  // 액세스 토큰 만료 지남
  if (status === 401 && message === 'expired token') {
    try {
      const response = await api.post('/member/refresh', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      return await refreshSucceed(response, config);
    } catch {
      return Promise.reject(newError);
    }
  }

  // 그냥 다시 로그인해야하는 상황
  if (status === 401) {
    return Promise.reject(newError);
  }
};

const refreshSucceed = async (response: AxiosResponse, config: InternalAxiosRequestConfig | undefined) => {
  // 토큰 재설정
  const newAccessToken = response.data.accessToken;
  const newRefreshToken = response.data.refreshToken;
  accessToken = newAccessToken;
  sessionStorage.setItem('refresh-token', newRefreshToken);

  // 토큰을 새로 담아 재요청
  if (config) {
    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
    const newResponse = await api(config);

    return newResponse;
  }
};

const refreshFail = (error: AxiosError) => {
  const newError = structuredClone(error);
  sessionStorage.removeItem('refresh-token');
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