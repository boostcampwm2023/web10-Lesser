import ChevronDownIcon from './../../assets/icons/ChevronDownIcon';

interface ReviewHeaderProps {
  reviewTabs: string[];
  currentReviewTab: string;
  onReviewTabChange: React.Dispatch<React.SetStateAction<string>>;
}

const ReviewHeader = ({ reviewTabs, currentReviewTab, onReviewTabChange }: ReviewHeaderProps) => (
  <header className="flex flex-col w-[60.25rem] gap-3">
    <p className="flex items-baseline gap-[0.563rem] text-m">
      <span className="font-bold text-l text-house-green">회고</span>
      여러분의 스프린트를 분석하고 개선하는 부분입니다.
    </p>
    <nav className="flex justify-between">
      <button className="flex items-center pl-4 py-[0.313rem] pr-2 rounded-md bg-starbucks-green font-bold text-true-white">
        SPRINT 1
        <ChevronDownIcon color="text-true-white" />
      </button>
      <ul className="flex gap-3 text-light-gray">
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

export default ReviewHeader;
