import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import { useModal } from '../../modal/useModal';
import { ReadBacklogTaskResponseDto } from '../../types/backlog';
import TaskModal from './Modal/TaskModal';

const TaskComponent = (props: ReadBacklogTaskResponseDto) => {
  const { open, close } = useModal();
  const { sequence, title, userId, point } = props;
  return (
    <>
      <div className="flex items-center justify-between border-t py-[0.563rem] pl-2.5 pr-[0.438rem] bg-white text-house-green text-r whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <span className="w-16 font-bold">Task{sequence}</span>
          <span className="w-[33.75rem]">{title}</span>
        </div>
        <span className="w-[6.25rem] truncate">{userId}</span>
        <span className="w-[5rem] truncate">{point}POINT</span>
        <button
          className="flex items-center font-bold hover:underline"
          onClick={() => {
            open(<TaskModal {...props} close={close} />);
          }}
        >
          상세보기
          <ChevronRightIcon size={14} />
        </button>
      </div>
    </>
  );
};

export default TaskComponent;
