import { Link } from 'react-router-dom';
import { projectElement } from '../../types/project';
import whiteCross from '../../assets/images/cross.png';
import ProjectCard from '../../components/project/ProjectCard';
import useLogout from '../../hooks/pages/useLogout';
import { useGetMyProjects } from '../../hooks/queries/project';

const ProjectPage = () => {
  const handleLogoutButtonClick = useLogout();

  const { data, isLoading } = useGetMyProjects();

  if (isLoading) return;

  console.log(data);

  return (
    <>
      <header className="flex gap-2 justify-center min-w-[76rem] pt-8 mb-6">
        <p className="bg-house-green w-[66.5rem] h-14 font-bold font-pretendard text-true-white text-l ps-3 flex flex-col justify-center rounded-[0.25rem]">
          내 프로젝트
        </p>
        <button
          className="bg-house-green w-[8.6875rem] h-14 font-bold font-pretendard text-true-white text-ml flex flex-col justify-center items-center rounded-[0.25rem]"
          onClick={handleLogoutButtonClick}
        >
          로그아웃
        </button>
      </header>
      <ul className="flex flex-wrap gap-x-5 gap-y-4 w-[76rem] min-w-[76rem] mx-auto">
        {data.map(({ id, name, nextPage, subject, myTaskCount, userList }: projectElement) => (
          <li key={id} className="list-none">
            <ProjectCard {...{ name, nextPage, subject, id, myTaskCount, userList }} />
          </li>
        ))}
        <Link
          to={'/project/create'}
          className="w-[7.5rem] h-[7.5rem] flex flex-col justify-center content-center gap-2 bg-starbucks-green rounded-[0.25rem] cursor-pointer"
        >
          <p className="font-bold text-center text-true-white font-pretendard text-r">새 프로젝트 생성</p>
          <img src={whiteCross} className="w-4 h-4 mx-auto" />
        </Link>
      </ul>
    </>
  );
};

export default ProjectPage;
