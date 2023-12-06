import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ReadBacklogTaskResponseDto } from '../../../types/backlog';
import TaskComponent from '../../backlog/TaskComponent';

interface SprintBacklogComponentProps {
  sprintBacklog: ReadBacklogTaskResponseDto[];
}

const SprintBacklogComponent = ({ sprintBacklog }: SprintBacklogComponentProps) => (
  <Droppable droppableId="sprintBacklog">
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
              <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                {(provided) => (
                  <div
                    className="w-full border-transparent-green"
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <TaskComponent {...task} />
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
