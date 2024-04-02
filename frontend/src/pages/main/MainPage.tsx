import { Outlet, Link } from "react-router-dom";
import { SVGReactElement } from "../../types/common";
import Landing from "../../assets/icons/landing.svg?react";
import ChevronRight from "../../assets/icons/chevron-right.svg?react";
import Backlog from "../../assets/icons/backlog.svg?react";
import { ROUTER_URL } from "../../constants/path";

interface PageIconProps {
  Icon: SVGReactElement;
  activated: boolean;
  to: string;
  pageName: string;
}

const PageIcon = ({ Icon, activated, to, pageName }: PageIconProps): JSX.Element => {
  if (activated) {
    return (
      <div className="flex justify-between items-center pl-2 pr-[0.3125rem] py-[0.3125rem] rounded-full cursor-pointer bg-white text-middle-green transition-all w-fit hover:min-w-[9.375rem] hover:shadow-box hover:gap-2 group">
        <Icon width={24} height={24} fill="#3A5624" className="shrink-0" />
        <p className="text-base font-bold shrink-0 select-none hidden group-hover:inline-flex">
          {pageName}
        </p>
        <ChevronRight width={18} height={18} stroke="#3A5624" className="shrink-0" />
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="group flex justify-center items-center w-[3.4375rem] text-white py-[0.3125rem] transition-all rounded-full cursor-pointer hover:min-w-[9.375rem] hover:shadow-box hover:gap-2 hover:bg-white hover:text-middle-green hover:pl-2 hover:pr-[0.3125rem] hover:justify-between"
    >
      <Icon
        width={24}
        height={24}
        fill="#FFFFFF"
        className="shrink-0 group-hover:fill-middle-green"
      />
      <p className="text-base font-bold shrink-0 select-none hidden group-hover:inline-flex">
        {pageName}
      </p>
      <ChevronRight
        width={18}
        height={18}
        stroke="#3A5624"
        className="shrink-0 hidden group-hover:inline-flex"
      />
    </Link>
  );
};

const MainPage = () => {
  return (
    <div className="flex justify-center items-center h-screen min-w-[76rem] gap-9">
      <div className="flex flex-col justify-between h-[40.5rem] bg-gradient-to-t from-sidebar-linear-from to-sidebar-linear-to rounded-lg shadow-box">
        <div className="flex flex-col pl-[0.9375rem] pt-[1.5625rem] w-[5.3125rem] gap-5 text-white">
          <PageIcon Icon={Landing} activated={true} to={ROUTER_URL.MAIN} pageName="메인페이지" />
          <PageIcon Icon={Backlog} activated={false} to={ROUTER_URL.BACKLOG} pageName="백로그" />
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
