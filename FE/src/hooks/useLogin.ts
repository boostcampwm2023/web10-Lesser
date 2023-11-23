import { NavigateFunction, useNavigate } from 'react-router';
import { api, setAccessToken } from '../apis/api';
import { SetURLSearchParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const login = async (code: string | null, navigate: NavigateFunction, setSearchParams: SetURLSearchParams) => {
  api
    .post(`/members/login`, { code })
    .then((response) => {
      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);

      navigate('/project');
    })
    .catch(() => {
      setSearchParams('');
    });
};

const useLogin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();

  const handleLoginButtonClick = (): void => {
    location.href = `https://github.com/login/oauth/authorize?client_id=9d51217b46b2a7fca4fe&scope=user:email%20repo`;
  };

  useEffect(() => {
    if (code) {
      login(code, navigate, setSearchParams);
    }
  }, []);

  return { code, handleLoginButtonClick };
};

export default useLogin;
