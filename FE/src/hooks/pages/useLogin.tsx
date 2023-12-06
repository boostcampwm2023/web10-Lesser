import { NavigateFunction, useNavigate } from 'react-router';
import { api, setAccessToken } from '../../apis/api';
import { SetURLSearchParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserState } from '../../stores';

const login = async (
  code: string | null,
  navigate: NavigateFunction,
  setSearchParams: SetURLSearchParams,
  updateUserState: ({ id, username }: { id: number; username: string }) => void,
) => {
  api
    .post(`/members/login`, { code })
    .then((response) => {
      const { accessToken, refreshToken, id, username } = response.data;
      setAccessToken(accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      updateUserState({ id: Number(id), username });
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
  const updateUserState = useUserState((state) => state.updateUserState);

  const handleLoginButtonClick = (): void => {
    location.href = `${import.meta.env.VITE_GITHUB_OAUTH_URL}?client_id=${
      import.meta.env.VITE_GITHUB_CLIENT_ID
    }&scope=user:email%20repo`;
  };

  useEffect(() => {
    if (code) {
      login(code, navigate, setSearchParams, updateUserState);
    }
  }, []);

  return { code, handleLoginButtonClick };
};

export default useLogin;
