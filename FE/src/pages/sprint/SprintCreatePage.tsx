import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../apis/api';
import SprintBacklogSetting from '../../components/sprint/sprintCreate/SprintBacklogSetting';
import { CreateProcessHeader, CreateProcessText } from '../../components/common/CreateProcess';
import { CLIENT_URL, PROCESS_NUMBER } from '../../constants/constants';
import { SprintBacklog, SprintCreateBody } from '../../types/sprint';
import SprintGoalSetting from './../../components/sprint/sprintCreate/SprintGoalSetting';
import usePostNewSprint from '../../hooks/queries/sprint/usePostNewSprint';
import { useSelectedProjectState } from '../../stores';
import { transformDate } from '../../utils/date';

const SprintCreatePage = () => {
  const [process, setProcess] = useState<number>(PROCESS_NUMBER.PROCESS1);
  const [sprintBacklog, setSprintBacklog] = useState<SprintBacklog[]>([]);
  const [sprintGoal, setSprintGoal] = useState<string>('');
  const [sprintEndDate, setSprintEndDate] = useState<string>('');
  const { id: projectId } = useSelectedProjectState();
  const { mutateAsync } = usePostNewSprint(projectId);
  const { data: backlog, isLoading } = useQuery({
    queryKey: ['backlogs', projectId, 'sprint'],
    queryFn: async () => {
      const response = await api.get('/backlogs/1');
      return response.data;
    },
  });
  const handleNextButtonClick = () => {
    setProcess(PROCESS_NUMBER.PROCESS2);
  };

  const handleCreateButtonClick = () => {
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
      <CreateProcessHeader backLink={CLIENT_URL.PROJECT}>
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
