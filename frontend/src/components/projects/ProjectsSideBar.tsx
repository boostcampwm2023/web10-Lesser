import { useNavigate } from "react-router-dom";
import { postLogout } from "../../apis/api/loginAPI";
import { ROUTER_URL } from "../../constants/path";
import { memberResponse } from "../../types/authDTO";
import { DEFAULT_MEMBER } from "../../constants/projects";

const ProjectsSideBar = () => {
  const navigate = useNavigate();
  const handleLogoutButtonClick = async () => {
    const response = await postLogout();
    if (response?.status === 200) {
      navigate(ROUTER_URL.ROOT);
    }
  };

  const userData: memberResponse = JSON.parse(
    window.localStorage.getItem("member") ?? DEFAULT_MEMBER
  );

  return (
    <aside className="pt-16 pb-10 ml-6 w-fit px-9 shadow-box">
      <h1 className="mb-16 text-5xl font-bold text-middle-green">내 프로젝트</h1>
      <p className="mb-8 font-semibold text-m text-dark-gray">프로젝트를 생성하고</p>
      <p className="mb-8 font-semibold text-m text-dark-gray">관리하고</p>
      <p className="mb-[9.625rem] font-semibold text-m text-dark-gray">확인해 보세요</p>
      <div className="w-[23.375rem] py-6 px-[1.875rem] flex items-center gap-6 bg-gradient-to-bl from-white-transparent to-90% bg-light-green rounded-[1.125rem] text-white">
        <img src={userData.imageUrl} alt="프로필 사진" />
        <div className="">
          <p className="font-semibold text-m">{userData.username}</p>
          <div className="flex gap-6 text-xs">
            <button type="button" className="" onClick={handleLogoutButtonClick}>
              Logout
            </button>
            <button type="button" className="">
              My Page
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProjectsSideBar;
