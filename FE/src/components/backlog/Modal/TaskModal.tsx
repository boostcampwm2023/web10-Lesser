import useGetUsername from '../../../hooks/pages/backlog/useGetUsername';
import { useModal } from '../../../modal/useModal';
import { ReadBacklogTaskResponseDto } from '../../../types/backlog';
import TaskModalItemLayout from '../TaskModalItemLayout';
import BacklogDeleteModal from './BacklogDeleteModal';
import TaskUpdateModal from './TaskUpdateModal';

export interface TaskModalProps extends ReadBacklogTaskResponseDto {
  close: () => void;
}

const TaskModal = (props: TaskModalProps) => {
  const { userId, title, point, condition, id, close } = props;
  const { getUsernameByUserid } = useGetUsername();
  const updateModal = useModal(false);
  const deleteModal = useModal();

  return (
    <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-30 flex justify-center items-center font-pretendard">
      <div className="w-[31.875rem] h-[33.75rem] rounded-md bg-white p-6 text-house-green flex flex-col justify-between">
        <p className="text-l font-bold">Task</p>
        <div className="flex flex-col gap-2">
          <TaskModalItemLayout title="업무 내용" description="Story를 구현하기 위해 필요한 업무를 작성합니다">
            <div className="w-full py-2 px-2.5 rounded-sm text-s border border-transperant-green bg-cool-neutral">
              {title}
            </div>
          </TaskModalItemLayout>
        </div>
        <TaskModalItemLayout title="인수 조건" description="Task를 완료하기 위한 조건을 작성합니다">
          <textarea
            className="w-full py-2 px-2.5 resize-none border rounded-sm text-s border-transperant-green bg-cool-neutral"
            rows={4}
            value={condition}
            disabled
          />
        </TaskModalItemLayout>
        <TaskModalItemLayout title="담당자" description="Task를 수행할 멤버를 선정합니다">
          <p className="w-[9.375rem] py-2 px-2.5 border rounded-sm text-s font-bold border-transperant-green bg-cool-neutral">
            {getUsernameByUserid(Number(userId))}
          </p>
        </TaskModalItemLayout>
        <TaskModalItemLayout title="Task Point" description="Task를 완료하기 위해 소요되는 시간을 예상합니다">
          <div className="flex w-[9.375rem] pr-3 items-center border rounded-sm border-transperant-green bg-cool-neutral justify-between">
            <p className="w-full py-2 px-2.5 text-s outline-none">{point}</p>
            <p className="font-bold text-starbucks-green">Point</p>
          </div>
        </TaskModalItemLayout>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="border w-14 rounded-md border-starbucks-green py-1.5 font-bold text-starbucks-green text-s"
            onClick={close}
          >
            취소
          </button>
          <button
            type="button"
            className="rounded-md w-14 py-1.5 font-bold text-true-white bg-error-red text-s"
            onClick={() => {
              deleteModal.open(<BacklogDeleteModal url="/task" id={id} close={deleteModal.close} />);
            }}
          >
            삭제
          </button>
          <button
            type="button"
            className="w-14 rounded-md py-1.5 bg-starbucks-green font-bold text-true-white text-s"
            onClick={() => {
              updateModal.open(<TaskUpdateModal {...{ ...props, close: updateModal.close }} />);
              close();
            }}
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
