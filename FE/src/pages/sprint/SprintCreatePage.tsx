import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../apis/api';
import SprintBacklogSetting from '../../components/sprint/sprintCreate/SprintBacklogSetting';
import { CreateProcessHeader, CreateProcessText } from '../../components/common/CreateProcess';
import { PROCESS_NUMBER } from '../../constants/constants';
import { SprintBacklogTask, SprintCreateBody } from '../../types/sprint';
import SprintGoalSetting from './../../components/sprint/sprintCreate/SprintGoalSetting';
import usePostNewSprint from '../../hooks/queries/sprint/usePostNewSprint';
import { useSelectedProjectState } from '../../stores';
import { transformDate } from '../../utils/date';
import { ReadBacklogEpicResponseDto } from '../../types/backlog';

const SprintCreatePage = () => {
  const [process, setProcess] = useState<number>(PROCESS_NUMBER.PROCESS1);
  const [sprintBacklog, setSprintBacklog] = useState<SprintBacklogTask[]>([]);
  const [sprintGoal, setSprintGoal] = useState<string>('');
  const [sprintEndDate, setSprintEndDate] = useState<string>('');
  const { id: projectId } = useSelectedProjectState();
  const { mutateAsync } = usePostNewSprint(projectId);
  const { data, isLoading } = useQuery({
    queryKey: ['backlogs', projectId, 'sprint'],
    queryFn: async () => {
      const { data } = await api.get(`/backlogs/${projectId}/notdone`);
      data.epicList.forEach((epic: { storyList: { taskList: SprintBacklogTask[] }[] }) => {
        epic.storyList.forEach((story) => {
          story.taskList = story.taskList.map((task, index) => {
            task.taskIndex = index;
            return task;
          });
        });
      });
      return data;
    },
  });

  const backlog = useMemo(() => {
    const newData = structuredClone(data);

    if (!sprintBacklog.length) {
      return newData;
    }

    sprintBacklog.forEach((sprintBacklogItem: SprintBacklogTask) => {
      const { epicIndex, storyIndex, taskIndex } = sprintBacklogItem;
      newData.epicList[epicIndex].storyList[storyIndex].taskList[taskIndex] = undefined;
    });

    newData.epicList.forEach((epic: ReadBacklogEpicResponseDto) => {
      epic.storyList.forEach((story) => {
        story.taskList = story.taskList.filter((task) => !!task);
      });
    });

    return newData;
  }, [data, sprintBacklog]);

  const handleNextButtonClick = () => {
    setProcess(PROCESS_NUMBER.PROCESS2);
  };

  const handleCreateButtonClick = () => {
    if (!sprintBacklog.length) {
      alert('스프린트 백로그를 추가해주세요.');
      return;
    }

    const dataBody: SprintCreateBody = {
      projectId,
      taskList: sprintBacklog.map(({ id }) => id),
      startDate: transformDate(new Date().toString()),
      endDate: sprintEndDate,
      goal: sprintGoal,
      title: 'sprint',
    };

    mutateAsync(dataBody);
  };

  if (isLoading) return <div>백로그 데이터 불러오는 중</div>;

  return (
    <>
      <CreateProcessHeader backLink={`/projects/${projectId}/sprint`}>
        <CreateProcessText processNum={1} processName="스프린트 이름" active={process >= 0} />
        <CreateProcessText processNum={2} processName="태스크 설정" active={process >= 1} />
      </CreateProcessHeader>
      {process === PROCESS_NUMBER.PROCESS1 ? (
        <SprintGoalSetting {...{ handleNextButtonClick, setSprintEndDate, setSprintGoal, sprintEndDate, sprintGoal }} />
      ) : (
        <SprintBacklogSetting
          {...{ backlog, sprintBacklog, setSprintBacklog, projectId }}
          onCreateButtonClick={handleCreateButtonClick}
        />
      )}
    </>
  );
};

export default SprintCreatePage;
