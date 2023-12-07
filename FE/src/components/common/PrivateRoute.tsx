import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isAccessTokenExisting, isRefreshTokenExisting } from '../../apis/api';
import { useEffect } from 'react';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAccessTokenExisting() && !isRefreshTokenExisting()) {
      navigate('/login');
      return;
    }

    if (location.pathname === '/') {
      navigate(`projects`);
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default PrivateRoute;
