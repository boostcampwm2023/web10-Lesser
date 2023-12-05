import { NavigateFunction, useNavigate } from 'react-router-dom';
import { api, setAccessToken } from '../../apis/api';
import { REFRESH_TOKEN } from '../../constants/constants';

const logout = (navigate: NavigateFunction) => {
  api.post('/members/logout').then(() => {
    setAccessToken(undefined);
    sessionStorage.removeItem(REFRESH_TOKEN);
    navigate('/login');
  });
};

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogoutButtonClick = () => {
    logout(navigate);
  };

  return handleLogoutButtonClick;
};

export default useLogout;
