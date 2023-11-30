import { SelectedSprint } from '../../types/review';
import ChevronRightIcon from './../../assets/icons/ChevronRightIcon';
import DountChart from './DonutChart';
import ReviewSprintInfo from './ReviewSprintInfo';

const ReviewSprint = (sprint: SelectedSprint) => {
  const totalCount = sprint.completedCount! + sprint.incompleteCount!;
  const progress = Number(((sprint.completedCount! / totalCount) * 100).toFixed(1));
  const completedTaskList = sprint.taskList!.filter((task) => task.completedAt);
  const uncompletedTaskList = sprint.taskList!.filter((task) => !task.completedAt);

  return (
    <div className="flex flex-col w-[60.25rem] h-[34.563rem] gap-6">
      <div className="flex w-full h-[8.75rem] gap-6 ">
        <div className="flex flex-1 h-full gap-[2.188rem] p-6 bg-true-white border border-transparent-green rounded-md">
          <div className="flex w-[5.625rem] h-[5.625rem]">
            <DountChart percent={progress} />
          </div>
          <div className="flex flex-col flex-1 gap-2 justify-center font-bold text-r">
            <p className="flex justify-between">
              <span>Task 진행률</span>
              <span>{progress} %</span>
            </p>
            <p className="flex justify-between text-starbucks-green">
              <span>완료 Task</span>
              <span>{sprint.completedCount} 개</span>
            </p>
            <p className="flex justify-between text-error-red">
              <span>미완료 Task</span>
              <span>{sprint.incompleteCount} 개</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-[39.375rem] h-full p-6 bg-true-white border border-transparent-green rounded-md text-s">
          <ReviewSprintInfo label="스프린트 목표" content={sprint.goal!} />
          <ReviewSprintInfo
            label="스프린트 기간"
            content={`${sprint.startDate!.split('T')[0]} ~ ${sprint.endDate!.split('T')[0]}`}
          />
          <ReviewSprintInfo label="전체 Task" content={`${totalCount} 개`} />
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full h-[24.313rem] p-6 bg-true-white border border-transparent-green rounded-md text-r text-house-green overflow-x-hidden overflow-y-auto">
        <ul>
          <span className="w-[5.625rem] font-bold text-starbucks-green">완료 Task</span>
          {completedTaskList.map((task) => (
            <li
              className="flex w-[57.25rem] justify-between py-[0.563rem] pl-2.5 pr-[0.438rem] border-t border-x last:border-b border-transparent-green font-medium"
              key={task.id}
            >
              <span className="w-[4rem] font-bold">Task {task.id}</span>
              <span className="w-[33.75rem]">{task.title}</span>
              <span className="w-[6.25rem]"></span>
              <span className="w-[5rem]">{task.point} POINT</span>
              <span className="flex items-center font-bold">
                상세보기 <ChevronRightIcon size={14} />
              </span>
            </li>
          ))}
        </ul>
        <ul>
          <span className="w-[5.625rem] font-bold text-error-red">미완료 Task</span>
          {uncompletedTaskList.map((task) => (
            <li
              className="flex w-[57.25rem] justify-between py-[0.563rem] pl-2.5 pr-[0.438rem] border-t border-x last:border-b border-transparent-green font-medium"
              key={task.id}
            >
              <span className="w-[4rem] font-bold">Task {task.id}</span>
              <span className="w-[33.75rem]">{task.title}</span>
              <span className="w-[6.25rem]"></span>
              <span className="w-[5rem]">{task.point} POINT</span>
              <span className="flex items-center font-bold">
                상세보기 <ChevronRightIcon size={14} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReviewSprint;
