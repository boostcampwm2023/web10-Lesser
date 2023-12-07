import MemberDropdown from '../MemberDropdown';
import TaskInputLayout from './TaskInputLayout';
import useTaskUsername from '../../../hooks/pages/backlog/useTaskUsername';
import ChevronUpIcon from '../../../assets/icons/ChevronUpIcon';
import ChevronDownIcon from '../../../assets/icons/ChevronDownIcon';
import { useEffect } from 'react';
import useDropdownToggle from '../../../hooks/pages/backlog/useDropdownToggle';

interface TaskFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  setNewTaskManager: (newId: number | null) => void;
  close: () => void;
  formRef: React.RefObject<HTMLFormElement>;
  defaultData?: {
    id: number;
    title: string;
    userId: string | number | null;
    point: number;
    condition: string;
  } | null;
}

const TaskForm = ({ handleSubmit, close, setNewTaskManager, formRef, defaultData = null }: TaskFormProps) => {
  const { detail, toggleDetail, detailRef } = useDropdownToggle();
  const { username, setNewUsername, resetUsername } = useTaskUsername(Number(defaultData?.userId));
  const handleDropdownClick = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    setNewTaskManager(Number(currentTarget.id));
    setNewUsername(Number(currentTarget.id));
    toggleDetail();
  };
  const handleDropdownResetClick = () => {
    setNewTaskManager(null);
    resetUsername();
    toggleDetail();
  };

  return (
    <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-30 flex justify-center items-center">
      <form
        className="w-[31.875rem] h-[33.75rem] rounded-md bg-white p-6 text-house-green flex flex-col justify-between"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <p className="text-l font-bold">Task</p>
        <TaskInputLayout title="업무 내용" description="Story를 구현하기 위해 필요한 업무를 작성합니다" htmlFor="title">
          <input
            className="w-full py-2 px-2.5 border rounded-sm border-starbucks-green outline-starbucks-green text-s"
            type="text"
            id="title"
            name="title"
            placeholder="어떤 업무를 수행할 예정인가요?"
            defaultValue={defaultData?.title}
          />
        </TaskInputLayout>
        <TaskInputLayout title="인수 조건" description="Task를 완료하기 위한 조건을 작성합니다." htmlFor="condition">
          <textarea
            className="w-full py-2 px-2.5 resize-none border rounded-sm border-starbucks-green outline-starbucks-green text-s "
            rows={4}
            id="condition"
            name="condition"
            placeholder={
              '예시 조건)\n' +
              '몇 개의 테스트 코드를 통과해야 합니다\n' +
              '사전에 작성한 예상 유저 시나리오와 비교하여 동작을 확인합니다'
            }
            defaultValue={defaultData?.condition}
          />
        </TaskInputLayout>
        <TaskInputLayout title="담당자" description="Task를 수행할 멤버를 선정합니다" htmlFor="userId">
          <div className="relative">
            <div className="w-[9.375rem] py-2 px-2.5 border rounded-sm border-starbucks-green outline-starbucks-green text-s flex items-center">
              <p className="w-full">{username}</p>
              <button
                type="button"
                onClick={() => {
                  toggleDetail();
                }}
              >
                {detail ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
              </button>
            </div>
            {detail && (
              <MemberDropdown
                ref={detailRef}
                setNewTaskManager={handleDropdownClick}
                resetTaskManager={handleDropdownResetClick}
              />
            )}
          </div>
        </TaskInputLayout>
        <TaskInputLayout
          title="Task Point"
          description="Task를 완료하기 위해 소요되는 시간을 예상합니다"
          htmlFor="point"
        >
          <div className="flex w-[9.375rem] pr-3 items-center border rounded-sm border-starbucks-green justify-between">
            <input
              className="w-full py-2 px-2.5 text-s outline-none"
              type="number"
              id="point"
              name="point"
              defaultValue={defaultData?.point}
              min={0}
            />
            <p className="font-bold text-starbucks-green">Point</p>
          </div>
        </TaskInputLayout>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="border rounded-md border-starbucks-green w-14 py-1.5 font-bold text-starbucks-green text-s"
            onClick={close}
          >
            취소
          </button>
          <button type="submit" className="rounded-md w-14 py-1.5 bg-starbucks-green font-bold text-true-white text-s">
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
