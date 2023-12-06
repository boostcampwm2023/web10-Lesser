import { useQuery } from '@tanstack/react-query';
import {
  ReadBacklogEpicResponseDto,
  ReadBacklogStoryResponseDto,
  ReadBacklogTaskResponseDto,
} from '../../types/backlog';
import { api } from '../../apis/api';
import EpicComponent from '../../components/backlog/EpicComponent';
import StoryComponent from '../../components/backlog/StoryComponent';
import TaskComponent from '../../components/backlog/TaskComponent';
import PostButton from '../../components/backlog/PostButton';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../constants/constants';

const BacklogPage = () => {
  const { id } = useParams();
  const REQUEST_URL = `${API_URL.BACKLOG}/${id}`;
  const { data, isLoading } = useQuery({
    queryKey: ['backlogs', 1],
    queryFn: async () => {
      const data = await api.get(REQUEST_URL);
      return data.data;
    },
  });

  if (isLoading) return <></>;

  return (
    <main className="flex flex-col gap-4 min-w-[60.25rem] font-pretendard select-none">
      <header className="flex items-center gap-[0.563rem]">
        <span className="font-bold text-l text-house-green">백로그</span>
        <span className="">여러분이 개발해야 할 기능과 제품의 요구 기능을 작성합니다</span>
      </header>
      {data.epicList.map((epic: ReadBacklogEpicResponseDto) => (
        <EpicComponent title={epic.title} id={epic.id} sequence={epic.sequence} key={`EPIC${epic.id}`}>
          <>
            {epic.storyList.map((story: ReadBacklogStoryResponseDto) => (
              <StoryComponent title={story.title} id={story.id} sequence={story.sequence} key={`STORY${story.id}`}>
                <>
                  {story.taskList.map((task: ReadBacklogTaskResponseDto) => (
                    <TaskComponent {...task} key={`TASK${task.id}`} />
                  ))}
                </>
              </StoryComponent>
            ))}
          </>
        </EpicComponent>
      ))}
      <PostButton
        title="Epic 생성하기"
        placeholder="어떤 기능을 계획할 예정인가요? 예시) 회원 기능"
        color="bg-house-green"
        url="/backlogs/epic"
        id={Number(id)}
      />
    </main>
  );
};

export default BacklogPage;
