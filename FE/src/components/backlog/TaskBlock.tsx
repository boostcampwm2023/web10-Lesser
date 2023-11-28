import { BacklogState, TaskData } from '../../types/backlog';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import useBlock from '../../hooks/useBlock';
import EditIcon from '../../assets/icons/EditIcon';
import BlockForm from './BlockFrom';
import TaskModal from './TaskModal';

interface TaskBlockProps {
  epicIndex: number;
  storyIndex: number;
  taskIndex: number;
  task: TaskData;
  backlogState: BacklogState;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
}

const TaskBlock = ({ epicIndex, storyIndex, taskIndex, task, backlogState, setBacklogState }: TaskBlockProps) => {
  const {
    newFormVisible,
    updateFormVisible,
    formRef,
    handleAddBlockButtonClick,
    handleEditBlockButtonClick,
    handleFormSubmit,
  } = useBlock({
    block: backlogState,
    setBlock: setBacklogState,
    epicIndex: epicIndex,
    storyIndex: storyIndex,
    taskIndex: taskIndex,
  });

  return (
    <div className="flex items-center justify-between border-t py-[0.563rem] pl-2.5 pr-[0.438rem] bg-white text-house-green text-r whitespace-nowrap">
      <div className="flex items-center gap-2.5">
        <span className="w-16 font-bold">Task</span>
        {updateFormVisible ? (
          <div className="w-[33.75rem]">
            <BlockForm
              initialTitle={task.title}
              placeholder="이 story를 구현하기 위한 구체적인 작업에는 어떤 것이 있나요? 예시) 로그인 페이지 UI 디자인"
              formRef={formRef}
              handleFormSubmit={(e) => handleFormSubmit(e, 'update', 'taskList')}
              onClose={handleEditBlockButtonClick}
            />
          </div>
        ) : (
          <button
            className="w-[33.75rem] group flex gap-1 hover:underline items-center"
            onClick={handleEditBlockButtonClick}
          >
            {task.title}
            <span className="hidden group-hover:flex">
              <EditIcon color="text-house-green" size={16} />
            </span>
          </button>
        )}
      </div>

      <span className="w-[6.25rem] truncate">{task.userName}</span>
      <span className="w-[5rem] truncate">{task.point}POINT</span>
      <button className="flex items-center font-bold" onClick={handleAddBlockButtonClick}>
        상세보기 <ChevronRightIcon size={14} />
      </button>

      {newFormVisible && (
        <TaskModal
          onClose={handleAddBlockButtonClick}
          {...{ backlogState, setBacklogState, task, epicIndex, storyIndex, taskIndex }}
        />
      )}
    </div>
  );
};

export default TaskBlock;
