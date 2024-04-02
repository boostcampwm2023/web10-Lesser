import { Outlet, Link, useLocation, useParams } from "react-router-dom";
import { SVGReactElement } from "../../types/common";
import { LINK_URL } from "../../constants/path";
import Landing from "../../assets/icons/landing.svg?react";
import ChevronRight from "../../assets/icons/chevron-right.svg?react";
import Backlog from "../../assets/icons/backlog.svg?react";
import Sprint from "../../assets/icons/sprint.svg?react";
import Setting from "../../assets/icons/settings.svg?react";

interface PageIconProps {
  Icon: SVGReactElement;
  activated: boolean;
  to: string;
  pageName: string;
}

const PageIcon = ({ Icon, activated, to, pageName }: PageIconProps): JSX.Element => {
  if (activated) {
    return (
      <div className="flex justify-between items-center pl-2 pr-[0.3125rem] py-[0.3125rem] rounded-full cursor-pointer bg-white text-middle-green transition-all w-fit hover:min-w-40 hover:shadow-box hover:gap-2 group">
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
      className="group flex justify-center items-center w-[3.4375rem] text-white py-[0.3125rem] transition-all rounded-full cursor-pointer hover:min-w-40 hover:shadow-box hover:gap-2 hover:bg-white hover:text-middle-green hover:pl-2 hover:pr-[0.3125rem] hover:justify-between"
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
  const { pathname } = useLocation();
  const { projectId } = useParams();
  if (!projectId) throw Error("잘못된 ProjectID 입니다.");
  return (
    <div className="flex justify-center items-center h-screen min-w-[76rem] gap-9">
      <div className="flex flex-col justify-between h-[40.5rem] bg-gradient-to-t from-sidebar-linear-from to-sidebar-linear-to rounded-lg shadow-box z-10">
        <div className="flex flex-col pl-[0.9375rem] pt-[1.5625rem] w-[5.3125rem] gap-5 text-white">
          <PageIcon
            Icon={Landing}
            activated={pathname === LINK_URL.MAIN(projectId)}
            to={LINK_URL.MAIN(projectId)}
            pageName="메인페이지"
          />
          <PageIcon
            Icon={Backlog}
            activated={pathname === LINK_URL.BACKLOG(projectId)}
            to={LINK_URL.BACKLOG(projectId)}
            pageName="백로그"
          />
          <PageIcon
            Icon={Sprint}
            activated={pathname === LINK_URL.SPRINT(projectId)}
            to={LINK_URL.SPRINT(projectId)}
            pageName="스프린트"
          />
          <PageIcon
            Icon={Setting}
            activated={pathname === LINK_URL.SETTINGS(projectId)}
            to={LINK_URL.SETTINGS(projectId)}
            pageName="프로젝트 설정"
          />
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
