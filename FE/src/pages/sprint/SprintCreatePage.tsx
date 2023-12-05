import { useState } from 'react';
import { PROCESS1, PROCESS2 } from '../../constants/constants';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../apis/api';
import SprintBacklogSetting from '../../components/sprint/SprintBacklogSetting';
import ProjectProcessText from '../../components/project/ProjectProcessText';
import { Link } from 'react-router-dom';
import chevronLeft from '../../assets/icons/chevron-left.svg';
import { ReadBacklogEpicResponseDto, ReadBacklogTaskResponseDto } from '../../types/backlog';

const SprintCreatePage = () => {
  const [process, setProcess] = useState<0 | 1>(PROCESS1);
  const [backlog, setBacklog] = useState<ReadBacklogEpicResponseDto[]>([]);
  const [sprintBacklog, setSprintBacklog] = useState<ReadBacklogTaskResponseDto[]>([]);
  const { isLoading } = useQuery({
    queryKey: ['backlogs', 1],
    queryFn: async () => {
      const response = await api.get('/backlogs/1');
      setBacklog(response.data.epicList);
      return response.data;
    },
  });
  const handleNextButtonClick = () => {
    setProcess(PROCESS2);
  };

  if (isLoading) return <div>백로그 데이터 불러오는 중</div>;

  return (
    <>
      <div className="min-w-[76rem] max-w-[76rem] gap-3 flex justify-between mx-auto pe-[6rem] pt-8 sticky top-0 bg-true-white pb-3">
        <Link to={'/backlog'} className="cursor-pointer flex gap-1 w-[6rem]">
          <img src={chevronLeft} />
          <p className="items-center my-auto text-sm">돌아가기</p>
        </Link>
        <div className="flex gap-[5rem] m-auto">
          <ProjectProcessText processNum={1} processName="스프린트 이름" active={process >= 0} />
          <ProjectProcessText processNum={2} processName="태스크 설정" active={process >= 1} />
        </div>
      </div>
      {process === PROCESS1 ? (
        <div>
          스프린트 제목, 기간 입력
          <button onClick={handleNextButtonClick}>다음으로</button>
        </div>
      ) : (
        <SprintBacklogSetting {...{ backlog, sprintBacklog, setBacklog, setSprintBacklog }} />
      )}
    </>
  );
};

export default SprintCreatePage;
