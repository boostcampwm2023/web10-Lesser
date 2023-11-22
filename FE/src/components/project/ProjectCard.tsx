import { projectCardElement } from '../../types/project';
import { Link } from 'react-router-dom';

const ProjectCard = ({ title, description, taskNum }: projectCardElement) => {
  return (
    <Link
      to={'/sprint'}
      className="w-[11.25rem] h-[7.5rem] bg-true-white px-3 pt-3 pb-6 border rounded-[0.25rem] border-transparent-green flex flex-col justify-between"
    >
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
    </Link>
  );
};

export default ProjectCard;
