interface projectElement {
  title: string;
  description: string;
  taskNum: number;
}

const ProjectCard = ({ title, description, taskNum }: projectElement) => {
  return (
    <div className="w-[11.25rem] h-[7.5rem] bg-true-white px-3 pt-3 pb-6">
      <div>{title}</div>
      <div>{description}</div>
      <div>내 진행 업무</div>
      <div>{taskNum}</div>
    </div>
  );
};

const ProjectPage = () => {
  const dummyData: Array<projectElement> = [
    {
      title: 'Lesser',
      description: '애자일 프로젝트 관리 툴',
      taskNum: 3,
    },
    {
      title: 'Lesser',
      description: '애자일 프로젝트 관리 툴',
      taskNum: 3,
    },
    {
      title: 'Lesser',
      description: '애자일 프로젝트 관리 툴',
      taskNum: 3,
    },
  ];

  return (
    <div>
      {dummyData.map(({ title, description, taskNum }) => (
        <ProjectCard title={title} description={description} taskNum={taskNum} />
      ))}
    </div>
  );
};

export default ProjectPage;
