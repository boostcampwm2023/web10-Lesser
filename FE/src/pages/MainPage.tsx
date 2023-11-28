import { Outlet } from 'react-router-dom';
import SideNavigationBar from '../components/backlog/SideNavigationBar';
const MainPage = () => (
  <div className="flex p-8 justify-center min-w-[76rem]">
    <SideNavigationBar />
    <div>
      <Outlet />
    </div>
  </div>
);

export default MainPage;
