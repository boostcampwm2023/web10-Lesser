import { useEffect, useRef, useState } from 'react';
import ChevronDownIcon from './../../assets/icons/ChevronDownIcon';

interface ReviewHeaderProps {
  reviewTabs: string[];
  currentReviewTab: string;
  onReviewTabChange: React.Dispatch<React.SetStateAction<string>>;
}

const ReviewHeader = ({ reviewTabs, currentReviewTab, onReviewTabChange }: ReviewHeaderProps) => {
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
          SPRINT 1
          <ChevronDownIcon color="text-true-white" size={16} />
        </button>

        {sprintListVisibility && (
          <ul className="flex flex-col w-[5.75rem] gap-[0.313rem] absolute top-8 p-3 items-center border border-light-gray rounded-md bg-true-white z-10 text-light-gray">
            {['SPRINT 2', 'SPRINT 3', 'SPRINT 4'].map((sprint, index) => (
              <li key={index}>
                <button>{sprint}</button>
              </li>
            ))}
          </ul>
        )}

        <ul className="flex gap-3 text-r text-light-gray">
          {reviewTabs.map((tab, index) => (
            <li key={index}>
              <button
                className={`${currentReviewTab === tab && 'font-bold text-starbucks-green'}`}
                onClick={() => onReviewTabChange(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="h-[0.063rem] mb-6 bg-transparent-green"></div>
    </header>
  );
};

export default ReviewHeader;
