import { Outlet } from 'react-router-dom';
import SideNavigationBar from '../components/backlog/SideNavigationBar';
const MainPage = () => (
  <div className="flex p-8">
    <SideNavigationBar />
    <Outlet />
  </div>
);

export default MainPage;
