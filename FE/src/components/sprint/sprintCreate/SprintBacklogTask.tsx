import ChevronRightIcon from '../../../assets/icons/ChevronRightIcon';
import useGetUsername from '../../../hooks/pages/backlog/useGetUsername';
import { useModal } from '../../../modal/useModal';
import { ReadBacklogTaskResponseDto } from '../../../types/backlog';
import TaskModal from '../../backlog/Modal/TaskModal';

const SprintBacklogTask = (props: ReadBacklogTaskResponseDto) => {
  const { open, close } = useModal();
  const { getUsernameByUserid } = useGetUsername();
  const { sequence, title, userId } = props;

  return (
    <>
      <div className="flex items-center justify-between border-t py-[0.563rem] pl-2.5 pr-[0.438rem] bg-white text-house-green text-r whitespace-nowrap">
        <div className="flex items-center gap-2.5 w-[80%]">
          <span className="w-16 font-bold">Task{sequence}</span>
          <span>{title}</span>
        </div>
        <span className="w-[5rem] truncate">{getUsernameByUserid(!userId ? undefined : Number(userId))}</span>
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

export default SprintBacklogTask;
