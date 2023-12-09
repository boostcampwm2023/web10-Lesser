import { Outlet } from 'react-router-dom';
import SideNavigationBar from '../components/common/SideNavigationBar';
const MainPage = () => (
  <div className="flex p-8 justify-center min-w-[76rem]">
    <SideNavigationBar />
    <div className="min-w-[60.25rem]">
      <Outlet />
    </div>
  </div>
);

export default MainPage;
