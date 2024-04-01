import { Outlet } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="flex justify-center items-center h-screen min-w-[76rem] gap-9">
      <div className="flex flex-col justify-between h-[40.5rem] bg-gradient-to-t from-sidebar-linear-from to-sidebar-linear-to rounded-lg">
        <div className="flex flex-col pl-[0.9375rem] pt-[1.5625rem] w-[5.3125rem] gap-5 text-white">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
        </div>
        <div className="w-[5.3125rem]"></div>
      </div>
      <div className="h-[40.5rem] min-w-[67.9375rem] border-2">
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;
