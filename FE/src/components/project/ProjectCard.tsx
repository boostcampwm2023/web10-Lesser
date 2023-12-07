import { CLIENT_URL } from '../../constants/constants';
import { useSelectedProjectState } from '../../stores';
import { projectElement } from '../../types/project';
import { Link } from 'react-router-dom';

const ProjectCard = ({ id, name, subject, nextPage, myTaskCount, userList }: projectElement) => {
  const NEXT_URL = nextPage === 'backlogs' ? CLIENT_URL.BACKLOG(id) : CLIENT_URL.SPRINT(id);
  const updateProjectData = useSelectedProjectState((state) => state.updateProjectData);
  const handleProjectCardClick = () => {
    updateProjectData({ id, userList });
  };
  return (
    <Link
      to={NEXT_URL}
      onClick={handleProjectCardClick}
      className="w-[11.25rem] h-[7.5rem] bg-true-white px-3 pt-3 pb-6 border rounded-[0.25rem] border-transparent-green flex flex-col justify-between"
    >
      <div className="flex flex-col gap-1">
        <p className="font-pretendard text-ml text-starbucks-green font-bold">{name}</p>
        <p className="font-pretendard text-s text-true-black font-medium">{subject}</p>
      </div>
      <div className="flex gap-1">
        <p className="font-pretendard text-s text-true-black font-medium">내 진행 업무</p>
        <div className="font-pretendard text-s bg-starbucks-green w-6 h-4 flex justify-center content-center rounded-[0.25rem]">
          <p className="text-true-white text-s font-medium">{myTaskCount}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
