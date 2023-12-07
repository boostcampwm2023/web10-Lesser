import { Draggable, Droppable } from 'react-beautiful-dnd';
import ClosedIcon from '../../../assets/icons/ClosedIcon';
import { SprintBacklog } from '../../../types/sprint';
import SprintBacklogTask from './SprintBacklogTask';
import { SPRINT_BACKLOG_DROP_ID } from '../../../constants/constants';

interface SprintBacklogComponentProps {
  sprintBacklog: SprintBacklog[];
  deleteSprintBacklog: (task: SprintBacklog, index: number) => void;
}

const SprintBacklogComponent = ({ sprintBacklog, deleteSprintBacklog }: SprintBacklogComponentProps) => (
  <Droppable droppableId={SPRINT_BACKLOG_DROP_ID}>
    {(provided) => (
      <div
        className="h-[31.75rem] border rounded-md bg-cool-neutral border-house-green flex flex-col items-center p-7"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {!sprintBacklog.length ? (
          <>
            <p className="mt-[11rem] mb-[1.25rem] font-bold text-ml text-light-gray">이번 스프린트에서 진행할 과제를</p>
            <p className="font-bold text-ml text-light-gray">백로그에서 드래그 하세요</p>
          </>
        ) : (
          <div className="w-full border-b border-x border-transparent-green">
            {sprintBacklog.map((task, index) => (
              <Draggable draggableId={JSON.stringify(task)} index={index} key={task.id}>
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
                    <button className="pr-2" onClick={() => deleteSprintBacklog(task, index)}>
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

export default SprintBacklogComponent;
