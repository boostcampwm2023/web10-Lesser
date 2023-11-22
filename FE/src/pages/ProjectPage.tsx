interface projectElement extends projectCardElement {
  projectId: number;
}

interface projectCardElement {
  title: string;
  description: string;
  taskNum: number;
}

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

const ProjectCard = ({ title, description, taskNum }: projectCardElement) => {
  return (
    <div className="w-[11.25rem] h-[7.5rem] bg-true-white px-3 pt-3 pb-6 border rounded-[0.25rem] border-transparent-green flex flex-col justify-between">
      <div className="flex flex-col gap-1">
        <div className="font-pretendard text-ml text-starbucks-green font-bold">{title}</div>
        <div className="font-pretendard text-s text-true-black font-medium">{description}</div>
      </div>
      <div className="flex gap-1">
        <div className="font-pretendard text-s text-true-black font-medium">내 진행 업무</div>
        <div className="font-pretendard text-s bg-starbucks-green w-6 h-4 flex justify-center content-center rounded-[0.25rem]">
          <div className="text-true-white text-s font-medium">{taskNum}</div>
        </div>
      </div>
    </div>
  );
};

const ProjectPage = () => {
  return (
    <>
      <div className="flex gap-2 justify-center min-w-[76rem] mt-8 mb-6">
        <div className="bg-house-green w-[66.5rem] h-14 font-bold font-pretendard text-true-white text-l ps-3 flex flex-col justify-center rounded-[0.25rem]">
          내 프로젝트
        </div>
        <div className="bg-house-green w-[8.6875rem] h-14 font-bold font-pretendard text-true-white text-ml flex flex-col justify-center rounded-[0.25rem] text-center">
          로그아웃
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-4 w-[76rem] min-w-[76rem] mx-auto">
        {dummyData.map(({ title, description, taskNum, projectId }) => (
          <li key={projectId} className="list-none">
            <ProjectCard title={title} description={description} taskNum={taskNum} />
          </li>
        ))}
      </div>
    </>
  );
};

export default ProjectPage;
