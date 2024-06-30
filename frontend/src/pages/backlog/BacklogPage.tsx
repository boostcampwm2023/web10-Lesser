import { Outlet } from "react-router-dom";
import BacklogHeader from "../../components/backlog/BacklogHeader";

const BacklogPage = () => (
  <div>
    <BacklogHeader />
    <Outlet />
  </div>
);

export default BacklogPage;
