import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkAccessToken } from "../../apis/utils/authAPI";
import { ROUTER_URL } from "../../constants/path";
import { useEffect } from "react";
import { SESSION_STORAGE_KEY } from "../../constants/storageKey";
import { postJoinProject } from "../../apis/api/projectAPI";

const InvitePage = () => {
  const { projectTitle, projectId: projectUUID } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleJoinButtonClick = async () => {
    const response = await postJoinProject(projectUUID!);

    switch (response.status) {
      case 201:
        alert("프로젝트에 참여되었습니다.");
        navigate("/projects");
        break;
      case 200:
        alert("이미 참여한 프로젝트입니다.");
        navigate(`/projects/${response.data.projectId}`);
        break;
    }
  };

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
        <p>{projectUUID}</p>
        <button
          type="button"
          className="w-[100px] h-[50px] bg-middle-green rounded text-white"
          onClick={handleJoinButtonClick}
        >
          참여하기
        </button>
      </main>
    </div>
  );
};

export default InvitePage;
