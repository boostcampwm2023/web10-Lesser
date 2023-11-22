import { projectElement } from '../types/project';
import ProjectCard from '../components/project/ProjectCard';
import whiteCross from '../assets/images/cross.png';
import { Link } from 'react-router-dom';

const dummyData: Array<projectElement> = [
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 0,
  },

  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 1,
  },
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 2,
  },
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 3,
  },
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 4,
  },
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 5,
  },
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 6,
  },
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 7,
  },
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 8,
  },
  {
    title: 'Lesser',
    description: '애자일 프로젝트 관리 툴',
    taskNum: 3,
    projectId: 9,
  },
];

const ProjectPage = () => {
  return (
    <>
      <header className="flex gap-2 justify-center min-w-[76rem] mt-8 mb-6">
        <div className="bg-house-green w-[66.5rem] h-14 font-bold font-pretendard text-true-white text-l ps-3 flex flex-col justify-center rounded-[0.25rem]">
          내 프로젝트
        </div>
        <div className="bg-house-green w-[8.6875rem] h-14 font-bold font-pretendard text-true-white text-ml flex flex-col justify-center rounded-[0.25rem] text-center">
          로그아웃
        </div>
      </header>
      <div className="flex flex-wrap gap-x-5 gap-y-4 w-[76rem] min-w-[76rem] mx-auto">
        {dummyData.map(({ title, description, taskNum, projectId }) => (
          <li key={projectId} className="list-none">
            <ProjectCard title={title} description={description} taskNum={taskNum} />
          </li>
        ))}
        <Link
          to={'/project/create'}
          className="w-[7.5rem] h-[7.5rem] flex flex-col justify-center content-center gap-2 bg-starbucks-green rounded-[0.25rem] cursor-pointer"
        >
          <div className="text-true-white font-pretendard font-bold text-r text-center">새 프로젝트 생성</div>
          <img src={whiteCross} className="w-4 h-4 mx-auto" />
        </Link>
      </div>
    </>
  );
};

export default ProjectPage;
