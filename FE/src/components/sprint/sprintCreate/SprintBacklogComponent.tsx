import { Draggable, Droppable } from 'react-beautiful-dnd';
import ClosedIcon from '../../../assets/icons/ClosedIcon';
import { SprintBacklog } from '../../../types/sprint';
import { useQueryClient } from '@tanstack/react-query';
import { ReadBacklogEpicResponseDto } from '../../../types/backlog';
import SprintBacklogTask from './SprintBacklogTask';

interface SprintBacklogComponentProps {
  sprintBacklog: SprintBacklog[];
  setSprintBacklog: React.Dispatch<React.SetStateAction<SprintBacklog[]>>;
  projectId: number;
}

const SprintBacklogComponent = ({ sprintBacklog, setSprintBacklog, projectId }: SprintBacklogComponentProps) => {
  const queryClient = useQueryClient();
  const handleDeleteButtonClick = (task: SprintBacklog, index: number) => {
    const { epicIndex, storyIndex, taskIndex } = task;

    queryClient.setQueryData(
      ['backlogs', projectId, 'sprint'],
      (prevBacklog: { epicList: ReadBacklogEpicResponseDto[] }) => {
        const newBacklogData = structuredClone(prevBacklog);
        newBacklogData.epicList[epicIndex].storyList[storyIndex].taskList.splice(taskIndex, 0, { ...task });
        return newBacklogData;
      },
    );

    setSprintBacklog((prevSprintBacklog) => {
      const newSprintBacklog = structuredClone(prevSprintBacklog);
      newSprintBacklog.splice(index, 1);
      return newSprintBacklog;
    });
  };

  return (
    <Droppable droppableId="sprintBacklog">
      {(provided) => (
        <div
          className="h-[31.75rem] border rounded-md bg-cool-neutral border-house-green flex flex-col items-center p-7"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {!sprintBacklog.length ? (
            <>
              <p className="mt-[11rem] mb-[1.25rem] font-bold text-ml text-light-gray">
                이번 스프린트에서 진행할 과제를
              </p>
              <p className="font-bold text-ml text-light-gray">백로그에서 드래그 하세요</p>
            </>
          ) : (
            <div className="w-full border-b border-x border-transparent-green">
              {sprintBacklog.map((task, index) => (
                <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                  {(provided) => (
                    <div
                      className="flex items-center justify-between"
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <div className="w-full">
                        <SprintBacklogTask {...task} />
                      </div>
                      <button className="pr-2" onClick={() => handleDeleteButtonClick(task, index)}>
                        <ClosedIcon color="text-error-red" />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default SprintBacklogComponent;
