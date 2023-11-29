import ChevronRightIcon from './../../assets/icons/ChevronRightIcon';
import DountChart from './DonutChart';
import ReviewSprintInfo from './ReviewSprintInfo';

const ReviewSprint = () => (
  <div className="flex flex-col w-[60.25rem] h-[34.563rem] gap-6">
    <div className="flex w-full h-[8.75rem] gap-6 ">
      <div className="flex flex-1 h-full gap-[2.188rem] p-6 bg-true-white border border-transparent-green rounded-md">
        <div className="flex w-[5.625rem] h-[5.625rem]">
          <DountChart percent={0.773} />
        </div>
        <div className="flex flex-col flex-1 gap-2 justify-center font-bold text-r">
          <p className="flex justify-between">
            <span>Task 진행률</span>
            <span>77.3 %</span>
          </p>
          <p className="flex justify-between text-starbucks-green">
            <span>완료 Task</span>
            <span>57 개</span>
          </p>
          <p className="flex justify-between text-error-red">
            <span>미완료 Task</span>
            <span>15 개</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[39.375rem] h-full p-6 bg-true-white border border-transparent-green rounded-md text-s">
        <ReviewSprintInfo label="스프린트 목표" content="백로그와 칸반보드가 보이는 이슈 관리 프로토타입을 만들자" />
        <ReviewSprintInfo label="스프린트 기간" content="23.07.11 ~ 23.07.20" />
        <ReviewSprintInfo label="전체 Task" content="72 개" />
      </div>
    </div>
    <div className="flex flex-col gap-6 w-full h-[24.313rem] p-6 bg-true-white border border-transparent-green rounded-md text-r text-house-green overflow-x-hidden overflow-y-auto">
      <div>
        <span className="w-[5.625rem] font-bold text-starbucks-green">완료 Task</span>
        <ul>
          <li className="flex w-[57.25rem] justify-between py-[0.563rem] pl-2.5 pr-[0.438rem] border-t border-x last:border-b border-transparent-green font-medium">
            <span className="w-[4rem] font-bold">Task1</span>
            <span className="w-[33.75rem]">[FE] 에픽 목록을 화면에 렌더링 하는 코드를 작성</span>
            <span className="w-[6.25rem]">멤버 A</span>
            <span className="w-[5rem]">2 POINT</span>
            <span className="flex items-center font-bold">
              상세보기 <ChevronRightIcon size={14} />
            </span>
          </li>
        </ul>
      </div>
      <div>
        <span className="w-[5.625rem] font-bold text-error-red">미완료 Task</span>
        <li className="flex w-[57.25rem] justify-between py-[0.563rem] pl-2.5 pr-[0.438rem] border-t border-x last:border-b border-transparent-green font-medium">
          <span className="w-[4rem] font-bold">Task1</span>
          <span className="w-[33.75rem]">[FE] 에픽 목록을 화면에 렌더링 하는 코드를 작성</span>
          <span className="w-[6.25rem]">멤버 A</span>
          <span className="w-[5rem]">2 POINT</span>
          <span className="flex items-center font-bold">
            상세보기 <ChevronRightIcon size={14} />
          </span>
        </li>
      </div>
    </div>
  </div>
);

export default ReviewSprint;
