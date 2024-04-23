import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { checkAccessToken } from "../../apis/utils/authAPI";
import { ROUTER_URL } from "../../constants/path";
import { useEffect } from "react";
import { SESSION_STORAGE_KEY } from "../../constants/storageKey";

const InvitePage = () => {
  const { projectTitle, projectId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAccessToken()) {
      sessionStorage.setItem(SESSION_STORAGE_KEY.REDIRECT, pathname);
      navigate(ROUTER_URL.LOGIN, { replace: true });
    }

    return () => {
      if (checkAccessToken()) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY.REDIRECT);
      }
    };
  }, []);

  return (
    <div className="w-[100%] min-w-[720px] h-[600px] flex justify-center items-center">
      <main>
        <p>프로젝트{projectTitle}에 초대되었습니다.</p>
        <p>{projectId}</p>
        <Link to={ROUTER_URL.PROJECTS} replace>
          <button
            type="button"
            className="w-[100px] h-[50px] bg-middle-green rounded text-white"
          >
            참여하기
          </button>
        </Link>
      </main>
    </div>
  );
};

export default InvitePage;
