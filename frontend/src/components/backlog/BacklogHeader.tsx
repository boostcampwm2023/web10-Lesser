import { useLocation } from "react-router-dom";
import TabButton from "./TabButton";
import { useMemo } from "react";
import { TAB_TITLE } from "../../constants/backlog";
import { BacklogPath } from "../../types/common/backlog";

const BacklogHeader = () => {
  const { pathname } = useLocation();
  const lastPath: BacklogPath = useMemo(() => {
    const path = pathname.split("/");
    return path[path.length - 1] as BacklogPath;
  }, [pathname]);

  return (
    <header className="flex items-baseline justify-between">
      <div className="flex items-baseline gap-2">
        <h1 className="font-bold text-m text-middle-green">
          {TAB_TITLE[lastPath]} 백로그
        </h1>
        <p className="">우선순위 내림차순</p>
      </div>
      <div className="flex gap-1">
        <TabButton title="스토리별" active={lastPath === "backlog"} link="" />
        <span className="text-text-gray">/</span>
        <TabButton title="에픽별" active={lastPath === "epic"} link="epic" />
        <span className="text-text-gray">/</span>
        <TabButton
          title="완료된 스토리"
          active={lastPath === "completed"}
          link="completed"
        />
      </div>
    </header>
  );
};

export default BacklogHeader;
