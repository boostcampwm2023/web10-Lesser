import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import RightBracketIcon from '../../../assets/icons/RightBracketIcon';
import BacklogComponent from './BacklogComponent';
import SprintBacklogComponent from './SprintBacklogComponent';
import { SprintBacklogTask, SprintBacklogEpic } from '../../../types/sprint';
import { SPRINT_BACKLOG_DROP_ID } from '../../../constants/constants';

interface SprintBacklogSettingProps {
  backlog: { epicList: SprintBacklogEpic[] };
  sprintBacklog: SprintBacklogTask[];
  setSprintBacklog: React.Dispatch<React.SetStateAction<SprintBacklogTask[]>>;
  onCreateButtonClick: () => void;
  projectId: number;
}

const SprintBacklogSetting = (props: SprintBacklogSettingProps) => {
  const { backlog, sprintBacklog, setSprintBacklog, onCreateButtonClick } = props;

  const deleteSprintBacklog = (index: number) => {
    setSprintBacklog((prevSprintBacklog) => {
      const newSprintBacklog = structuredClone(prevSprintBacklog);
      newSprintBacklog.splice(index, 1);
      return newSprintBacklog;
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      if (source.droppableId === SPRINT_BACKLOG_DROP_ID) {
        deleteSprintBacklog(source.index);
      }

      return;
    }

    if (destination.droppableId === source.droppableId && destination.index !== source.index) {
      setSprintBacklog((prevSprintBacklog) => {
        const newSprintBacklog = structuredClone(prevSprintBacklog);
        const task = newSprintBacklog.splice(source.index, 1)[0];
        newSprintBacklog.splice(destination.index, 0, task);
        return newSprintBacklog;
      });

      return;
    }

    const [epicIndex, storyIndex] = source.droppableId.split(' ').map((id) => Number(id));

    const targetTask: SprintBacklogTask = {
      ...backlog.epicList[epicIndex].storyList[storyIndex].taskList[source.index],
      epicIndex,
      storyIndex,
    };

    setSprintBacklog((prevSprintBacklog) => {
      const newSprintBacklog = structuredClone(prevSprintBacklog);
      newSprintBacklog.splice(destination.index, 0, targetTask);
      return newSprintBacklog;
    });
  };

  return (
    <div className="max-w-[76rem] mx-auto mt-5">
      <p className="min-w-[76rem] mb-3">
        <span className="font-bold text-l text-house-green">태스크 설정하기</span>{' '}
        <span className="font-medium text-s">이번주 스프린트를 달성하기 위해 수행할 태스크를 선택합니다.</span>
      </p>
      <div className="flex gap-3">
        <DragDropContext onDragEnd={onDragEnd}>
          <BacklogComponent backlog={backlog} />
          <div className="sticky flex gap-3 top-[4.5rem] min-h-[33.75rem] max-h-[33.75rem]">
            <div className="flex flex-col items-center self-center">
              <RightBracketIcon />
              <p className="mt-2 font-bold text-starbucks-green text-s">DRAG</p>
              <p className="font-bold text-starbucks-green text-s">&</p>
              <p className="font-bold text-starbucks-green text-s">DROP</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[36.25rem] max-w-[36.25rem]">
              <SprintBacklogComponent {...{ sprintBacklog, deleteSprintBacklog }} />
              <button className="p-3 rounded bg-starbucks-green text-true-white" onClick={onCreateButtonClick}>
                스프린트 생성하기
              </button>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default SprintBacklogSetting;
