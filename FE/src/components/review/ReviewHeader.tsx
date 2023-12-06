import { useEffect, useRef, useState } from 'react';
import ChevronDownIcon from './../../assets/icons/ChevronDownIcon';
import { Link, useParams } from 'react-router-dom';
import { Sprint } from '../../types/review';

interface ReviewHeaderProps {
  sprintList: Sprint[];
  currentSprintId: number;
  setSprintId: React.Dispatch<React.SetStateAction<number>>;
}

const ReviewHeader = ({ sprintList, currentSprintId, setSprintId }: ReviewHeaderProps) => {
  const reviewTabs = ['스프린트 정보', '차트', '회고란'];
  const { '*': currentReviewTab } = useParams();

  const [sprintListVisibility, setSprintListVisibility] = useState<boolean>(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleSprintListButtonClick = () => {
    setSprintListVisibility(!sprintListVisibility);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target !== btnRef.current) {
        setSprintListVisibility(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex flex-col w-[60.25rem] gap-3">
      <p className="flex items-baseline gap-[0.563rem] text-m">
        <span className="font-bold text-l text-house-green">회고</span>
        여러분의 스프린트를 분석하고 개선하는 부분입니다.
      </p>
      <nav className="relative flex justify-between text-s">
        <button
          className="flex items-center gap-0.5 pl-4 py-[0.313rem] pr-2 rounded-md bg-starbucks-green font-bold text-true-white"
          ref={btnRef}
          onClick={handleSprintListButtonClick}
        >
          SPRINT {currentSprintId}
          <ChevronDownIcon color="text-true-white" size={16} />
        </button>

        {sprintListVisibility && (
          <ul className="flex flex-col w-[5.75rem] gap-[0.313rem] absolute top-8 p-3 items-center border border-light-gray rounded-md bg-true-white z-10 text-light-gray">
            {Object.values(sprintList).map((sprint) => (
              <li key={sprint.title}>
                <button
                  className={`${currentSprintId === sprint.sprintId && 'font-bold text-starbucks-green'}`}
                  onClick={() => setSprintId(() => sprint.sprintId)}
                >
                  SPRINT {sprint.sprintId}
                </button>
              </li>
            ))}
          </ul>
        )}

        <ul className="flex gap-3 text-r text-light-gray">
          {reviewTabs.map((tab, index) => {
            const urlSegment = tab === '차트' ? '/chart' : tab === '회고란' ? '/remi' : '';
            return (
              <li key={index}>
                <Link
                  to={`/review/sprint${urlSegment}`}
                  className={`${currentReviewTab === urlSegment.substring(1) && 'font-bold text-starbucks-green'}`}
                >
                  {tab}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="h-[0.063rem] mb-6 bg-transparent-green"></div>
    </header>
  );
};

export default ReviewHeader;
