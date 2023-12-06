import { NavigateFunction, useNavigate } from 'react-router-dom';
import { api, setAccessToken } from '../../apis/api';
import { REFRESH_TOKEN } from '../../constants/constants';
import { useUserState } from '../../stores';

const logout = (navigate: NavigateFunction, deleteUserState: () => void) => {
  api.post('/members/logout').then(() => {
    setAccessToken(undefined);
    sessionStorage.removeItem(REFRESH_TOKEN);
    deleteUserState();
    navigate('/login');
  });
};

const useLogout = () => {
  const navigate = useNavigate();
  const deleteUserState = useUserState((state) => state.deleteUserState);

  const handleLogoutButtonClick = () => {
    logout(navigate, deleteUserState);
  };

  return handleLogoutButtonClick;
};

export default useLogout;
