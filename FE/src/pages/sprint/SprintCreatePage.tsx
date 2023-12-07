import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../apis/api';
import SprintBacklogSetting from '../../components/sprint/sprintCreate/SprintBacklogSetting';
import { CreateProcessHeader, CreateProcessText } from '../../components/common/CreateProcess';
import { BACKLOG_URL, PROCESS_NUMBER } from '../../constants/constants';
import { SprintBacklog } from '../../types/sprint';

const SprintCreatePage = () => {
  const [process, setProcess] = useState<number>(PROCESS_NUMBER.PROCESS1);
  const [sprintBacklog, setSprintBacklog] = useState<SprintBacklog[]>([]);
  const { data: backlog, isLoading } = useQuery({
    queryKey: ['backlogs', 1, 'sprint'],
    queryFn: async () => {
      const response = await api.get('/backlogs/1');
      return response.data;
    },
  });
  const handleNextButtonClick = () => {
    setProcess(PROCESS_NUMBER.PROCESS2);
  };

  if (isLoading) return <div>백로그 데이터 불러오는 중</div>;

  return (
    <>
      <CreateProcessHeader backLink={BACKLOG_URL.BACKLOG}>
        <CreateProcessText processNum={1} processName="스프린트 이름" active={process >= 0} />
        <CreateProcessText processNum={2} processName="태스크 설정" active={process >= 1} />
      </CreateProcessHeader>
      {process === PROCESS_NUMBER.PROCESS1 ? (
        <div>
          스프린트 제목, 기간 입력
          <button onClick={handleNextButtonClick}>다음으로</button>
        </div>
      ) : (
        <SprintBacklogSetting {...{ backlog, sprintBacklog, setSprintBacklog }} />
      )}
    </>
  );
};

export default SprintCreatePage;
