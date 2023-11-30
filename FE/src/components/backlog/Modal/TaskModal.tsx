import { useModal } from '../../../modal/useModal';
import { ReadBacklogTaskResponseDto } from '../../../types/backlog';
import TaskUpdateModal from './TaskUpdateModal';

interface TaskModalProps extends ReadBacklogTaskResponseDto {
  close: () => void;
}

const TaskModal = (props: TaskModalProps) => {
  const { userId, title, point, condition, close } = props;
  const modal = useModal(false);

  return (
    <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-30 flex justify-center items-center font-pretendard">
      <div className="w-[31.875rem] h-[33.75rem] rounded-md bg-white p-6 text-house-green flex flex-col justify-between">
        <p className="text-l font-bold">Task</p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-baseline">
            <span className="text-m font-bold pr-2">업무 내용</span>
            <span className="text-s">Story를 구현하기 위해 필요한 업무를 작성합니다</span>
          </div>
          <div className="w-full py-2 px-2.5 rounded-sm text-s border border-starbucks-green outline-starbucks-green">
            {title}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-baseline">
            <span className="text-m font-bold pr-2">인수조건</span>
            <span className="text-s">Task를 완료하기 위한 조건을 작성합니다.</span>
          </div>
          <textarea
            className="w-full py-2 px-2.5 resize-none border rounded-sm border-starbucks-green text-s bg-true-white"
            rows={4}
            value={condition}
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-s">
            <span className="text-m font-bold pr-2">담당자</span>
            Task를 수행할 멤버를 선정합니다
          </div>
          <div className="w-[9.375rem] py-2 px-2.5 border rounded-sm text-s border-starbucks-green">{userId}</div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-s">
            <span className="text-m font-bold pr-2">Point</span>
            Task를 완료하기 위해 소요되는 시간을 예상합니다
          </span>

          <div className="flex w-[9.375rem] pr-3 items-center border rounded-sm border-starbucks-green justify-between">
            <p className="w-full py-2 px-2.5 text-s outline-none">{point}</p>
            <p className="font-bold text-starbucks-green">Point</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="border-2 rounded-md border-starbucks-green px-4 py-1.5 font-bold text-starbucks-green text-s"
            onClick={close}
          >
            취소
          </button>
          <button
            type="button"
            className="border-2 rounded-md border-starbucks-green px-4 py-1.5 bg-starbucks-green font-bold text-true-white text-s"
            onClick={() => {
              modal.open(<TaskUpdateModal close={modal.close} defaultData={props} />);
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
