import { useState } from 'react';
import CalendarIcon from '../../../assets/icons/CalendarIcon';

interface SprintGoalSettingProps {
  handleNextButtonClick: () => void;
}

const SprintGoalSetting = ({ handleNextButtonClick }: SprintGoalSettingProps) => {
  const [sprintGoal, setSprintGoal] = useState<string>('');
  const [sprintEndDate, setSprintEndDate] = useState<string>('');
  const [isDateInput, setIsDateInput] = useState<boolean>(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sprintGoal.trim() === '') {
      window.alert('스프린트 목표를 입력해주세요.');
      return;
    }
    if (sprintEndDate === '') {
      window.alert('스프린트 기간을 입력해주세요.');
      return;
    }
    handleNextButtonClick();
  };

  return (
    <div className="flex flex-col w-[500px] mx-auto mt-[140px] items-center">
      <p className="mb-14 font-bold text-starbucks-green text-xl ">스프린트 만들기</p>
      <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit}>
        <label className="font-bold text-starbucks-green" htmlFor="goal">
          이번 스프린트는 어떤 것을 만들 것인가요?
        </label>
        <input
          className="p-3 border-2 border-starbucks-green outline-none rounded-md"
          type="text"
          id="goal"
          placeholder="스프린트 목표"
          value={sprintGoal}
          onChange={(e) => setSprintGoal(e.target.value)}
        />
        <label className="font-bold text-starbucks-green" htmlFor="date">
          스프린트 기간은 어떻게 되나요?
        </label>
        <div className="flex items-center w-[167px] h-[45px] px-3 border-2 border-starbucks-green outline-house-green rounded-md text-light-gray">
          <input
            className="w-full outline-none bg-transparent"
            type={isDateInput ? 'date' : 'text'}
            id="date"
            placeholder="종료일"
            value={sprintEndDate}
            onFocus={() => setIsDateInput(true)}
            onBlur={() => setIsDateInput(false)}
            onChange={(e) => setSprintEndDate(e.target.value)}
          />
          {!isDateInput && (
            <label htmlFor="date">
              <CalendarIcon color="text-starbucks-green" />
            </label>
          )}
        </div>
        <button className="p-3 bg-starbucks-green rounded-md font-bold text-m text-true-white">다음으로</button>
      </form>
    </div>
  );
};

export default SprintGoalSetting;
