import { BacklogState, TaskData } from '../../types/backlog';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import useBlock from '../../hooks/useBlock';
import EditIcon from '../../assets/icons/EditIcon';
import BlockForm from './BlockFrom';

interface TaskBlockProps {
  epicIndex: number;
  storyIndex: number;
  taskIndex: number;
  task: TaskData;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
}

const TaskBlock = ({ epicIndex, storyIndex, taskIndex, task, setBacklogState }: TaskBlockProps) => {
  const { updateFormVisible, formRef, handleEditBlockButtonClick, handleFormSubmit } = useBlock({
    setBlock: setBacklogState,
    epicIndex: epicIndex,
    storyIndex: storyIndex,
    taskIndex: taskIndex,
  });

  return (
    <div className="flex items-center border-t py-2 px-4 gap-16 text-house-green text-r whitespace-nowrap ">
      <p className="font-bold">Task</p>

      {updateFormVisible ? (
        <BlockForm
          currentBlock="task"
          initialTitle={task.title}
          formRef={formRef}
          handleFormSubmit={(e) => handleFormSubmit(e, 'update', 'tasks')}
          onClose={handleEditBlockButtonClick}
        />
      ) : (
        <button className="w-full group flex gap-1 hover:underline items-center" onClick={handleEditBlockButtonClick}>
          {task.title}
          <span className="hidden group-hover:flex">
            <EditIcon color="text-house-green" size={16} />
          </span>
        </button>
      )}
      <p>{task.point} POINT</p>
      <p>{task.member}</p>
      <button className="flex items-center font-bold">
        상세보기 <ChevronRightIcon size={14} />
      </button>
    </div>
  );
};

export default TaskBlock;
