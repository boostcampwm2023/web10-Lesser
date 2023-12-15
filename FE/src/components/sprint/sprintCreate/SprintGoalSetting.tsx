import { ChangeEvent, SetStateAction, useState } from 'react';
import { transformDate } from '../../../utils/date';

interface SprintGoalSettingProps {
  handleNextButtonClick: () => void;
  sprintGoal: string;
  sprintEndDate: string;
  setSprintGoal: React.Dispatch<SetStateAction<string>>;
  setSprintEndDate: React.Dispatch<SetStateAction<string>>;
}

const SprintGoalSetting = ({
  sprintEndDate,
  sprintGoal,
  setSprintEndDate,
  setSprintGoal,
  handleNextButtonClick,
}: SprintGoalSettingProps) => {
  const [sprintGoalError, setSprintGoalError] = useState(false);
  const [sprintEndDateError, setSprintEndDateError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sprintGoal === '') {
      setSprintGoalError(true);
      return;
    }
    if (sprintEndDate === '') {
      setSprintEndDateError(true);
      return;
    }
    handleNextButtonClick();
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setSprintEndDate('');
      return;
    }

    const today = new Date();

    if (e.target.value > transformDate(today.toString())) {
      setSprintEndDate(e.target.value);
    } else {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSprintEndDate(transformDate(tomorrow.toString()));
    }

    setSprintEndDateError(false);
  };

  const handleSprintGoalBlur = () => {
    const newSprintGoal = sprintGoal.trim();

    if (newSprintGoal === '') {
      setSprintGoalError(true);
    } else {
      setSprintGoalError(false);
    }
    setSprintGoal(newSprintGoal);
  };

  const handleEndDateBlur = () => {
    if (sprintEndDate === '') {
      setSprintEndDateError(true);
    }
  };

  return (
    <div className="flex flex-col w-[500px] mx-auto mt-[140px] items-center">
      <p className="text-xl font-bold mb-14 text-starbucks-green ">스프린트 만들기</p>
      <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-starbucks-green" htmlFor="goal">
            이번 스프린트는 어떤 것을 만들 것인가요?
          </label>
          <input
            className={`w-full p-3 border-2 outline-none focus:border-transparent focus:ring-2 duration-300 rounded-md ${
              sprintGoalError
                ? 'border-error-red focus:ring-error-red'
                : 'border-transparent-green focus:ring-starbucks-green'
            }`}
            type="text"
            id="goal"
            placeholder="스프린트 목표"
            value={sprintGoal}
            onChange={(e) => setSprintGoal(e.target.value)}
            onBlur={handleSprintGoalBlur}
            autoComplete="off"
          />
          {sprintGoalError && <span className="pl-2 text-error-red text-r">스프린트 목표를 입력해주세요</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-starbucks-green" htmlFor="date">
            스프린트 종료일은 어떻게 되나요?
          </label>
          <input
            className={`flex items-center w-[167px] h-[45px] px-3 border-2 outline-none focus:border-transparent focus:ring-2 duration-300 rounded-md ${
              sprintEndDate === '' && 'text-light-gray'
            } ${
              sprintEndDateError
                ? 'border-error-red focus:ring-error-red'
                : 'border-transparent-green focus:ring-starbucks-green'
            }`}
            type="date"
            id="date"
            value={sprintEndDate}
            onChange={handleEndDateChange}
            onBlur={handleEndDateBlur}
          />
          {sprintEndDateError && <span className="pl-2 text-error-red text-r">스프린트 종료일을 입력해주세요</span>}
        </div>
        <button className="p-3 bg-starbucks-green rounded-md font-bold text-m text-true-white">다음으로</button>
      </form>
    </div>
  );
};

export default SprintGoalSetting;
