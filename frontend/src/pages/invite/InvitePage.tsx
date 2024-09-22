import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { checkAccessToken } from "../../apis/utils/authAPI";
import { ROUTER_URL } from "../../constants/path";
import { useEffect } from "react";
import { STORAGE_KEY } from "../../constants/storageKey";
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
      case 409:
        alert("정원 초과로 참여할 수 없습니다.");
        navigate(`/projects`);
        break;
    }
  };

  useEffect(() => {
    if (!checkAccessToken()) {
      sessionStorage.setItem(STORAGE_KEY.REDIRECT, pathname);
      navigate(ROUTER_URL.LOGIN, { replace: true });
    }

    return () => {
      if (checkAccessToken()) {
        sessionStorage.removeItem(STORAGE_KEY.REDIRECT);
      }
    };
  }, []);

  return (
    <div className="w-[100%] min-w-[720px] h-[720px] flex justify-center items-center">
      <main className="bg-white shadow-box w-[42.5rem] h-[27.5rem] flex justify-center items-center">
        <div className="w-[40rem] h-[25rem] border-middle-green border px-10 py-8">
          <p className="self-start font-bold break-words text-xxl">
            Leader<span className="font-light">님의</span>
          </p>
          <p className="self-start font-bold break-words text-xxl">
            {projectTitle}
          </p>
          <p className="self-start mt-8">
            leader님의 {projectTitle} 프로젝트에 참여하고 싶다면 요청을
            보내세요.
          </p>
          <div className="flex flex-col w-[35rem] gap-5 mt-14">
            <button
              className="w-full h-[2.5rem] rounded-lg text-white bg-middle-green"
              type="button"
              onClick={handleJoinButtonClick}
            >
              프로젝트 참여 요청
            </button>
            <Link to={ROUTER_URL.PROJECTS}>
              <button
                className="w-full h-[2.5rem] rounded-lg text-white bg-dark-gray"
                type="button"
              >
                내 프로젝트
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvitePage;
