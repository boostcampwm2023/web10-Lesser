import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import RightBracketIcon from '../../../assets/icons/RightBracketIcon';
import { ReadBacklogEpicResponseDto } from '../../../types/backlog';
import BacklogComponent from './BacklogComponent';
import SprintBacklogComponent from './SprintBacklogComponent';
import { useQueryClient } from '@tanstack/react-query';
import { SprintBacklog } from '../../../types/sprint';

interface SprintBacklogSettingProps {
  backlog: { epicList: ReadBacklogEpicResponseDto[] };
  sprintBacklog: SprintBacklog[];
  setSprintBacklog: React.Dispatch<React.SetStateAction<SprintBacklog[]>>;
}

const SprintBacklogSetting = (props: SprintBacklogSettingProps) => {
  const { backlog, sprintBacklog, setSprintBacklog } = props;
  const queryClient = useQueryClient();

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
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

    const targetTask: SprintBacklog = {
      ...backlog.epicList[epicIndex].storyList[storyIndex].taskList[source.index],
      epicIndex,
      storyIndex,
      taskIndex: source.index,
    };

    queryClient.setQueryData(['backlogs', 1, 'sprint'], (prevBacklog: { epicList: ReadBacklogEpicResponseDto[] }) => {
      const newBacklogData = structuredClone(prevBacklog);
      newBacklogData.epicList[epicIndex].storyList[storyIndex].taskList.splice(source.index, 1);
      return newBacklogData;
    });

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
              <SprintBacklogComponent sprintBacklog={sprintBacklog} setSprintBacklog={setSprintBacklog} />
              <button className="p-3 rounded bg-starbucks-green text-true-white">스프린트 생성하기</button>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default SprintBacklogSetting;
