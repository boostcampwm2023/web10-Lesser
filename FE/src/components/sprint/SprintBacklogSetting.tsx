import RightBracketIcon from '../../assets/icons/RightBracketIcon';
import {
  ReadBacklogEpicResponseDto,
  ReadBacklogStoryResponseDto,
  ReadBacklogTaskResponseDto,
} from '../../types/backlog';
import EpicComponent from '../backlog/EpicComponent';
import PostButton from '../backlog/PostButton';
import StoryComponent from '../backlog/StoryComponent';
import TaskComponent from '../backlog/TaskComponent';

interface SprintBacklogSettingProps {
  backlog: { epicList: ReadBacklogEpicResponseDto[] };
  sprintBacklog: ReadBacklogTaskResponseDto[];
  setSprintBacklog: React.Dispatch<React.SetStateAction<ReadBacklogTaskResponseDto[]>>;
}

const SprintBacklogSetting = (props: SprintBacklogSettingProps) => {
  const { backlog } = props;
  return (
    <div className="max-w-[76rem] mx-auto mt-5">
      <p className="min-w-[76rem] mb-3">
        <span className="font-bold text-l text-house-green">태스크 설정하기</span>{' '}
        <span className="font-medium text-s">이번주 스프린트를 달성하기 위해 수행할 태스크를 선택합니다.</span>
      </p>
      <div className="flex gap-3">
        <div className="min-w-[36.25rem] flex flex-col gap-4 mb-8">
          {backlog.epicList.map((epic: ReadBacklogEpicResponseDto) => (
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
            id={1}
          />
        </div>
        <div className="sticky flex gap-3 top-[4.5rem] min-h-[33.75rem] max-h-[33.75rem]">
          <div className="flex flex-col items-center self-center">
            <RightBracketIcon />
            <p className="mt-2 font-bold text-starbucks-green text-s">DRAG</p>
            <p className="font-bold text-starbucks-green text-s">&</p>
            <p className="font-bold text-starbucks-green text-s">DROP</p>
          </div>
          <div className="flex flex-col gap-3 min-w-[36.25rem]">
            <div className="h-[31.75rem] border rounded-md bg-cool-neutral border-house-green flex flex-col items-center">
              {!props.sprintBacklog.length && (
                <>
                  <p className="mt-[13rem] mb-[1.25rem] font-bold text-ml text-light-gray">
                    이번 스프린트에서 진행할 과제를
                  </p>
                  <p className="font-bold text-ml text-light-gray">백로그에서 드래그 하세요</p>
                </>
              )}
            </div>
            <button className="p-3 rounded bg-starbucks-green text-true-white">스프린트 생성하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintBacklogSetting;
