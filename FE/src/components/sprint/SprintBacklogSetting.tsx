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
  backlog: ReadBacklogEpicResponseDto[];
  sprintBacklog: ReadBacklogTaskResponseDto[];
  setBacklog: React.Dispatch<React.SetStateAction<ReadBacklogEpicResponseDto[]>>;
  setSprintBacklog: React.Dispatch<React.SetStateAction<ReadBacklogTaskResponseDto[]>>;
}

const SprintBacklogSetting = (props: SprintBacklogSettingProps) => (
  <div>
    <p>
      <span>태스크 설정하기</span> <span>이번주 스프린트를 달성하기 위해 수행할 태스크를 선택합니다.</span>
    </p>
    <div>
      {props.backlog.map((epic: ReadBacklogEpicResponseDto) => (
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
        id={2}
      />
    </div>
    <div>
      <RightBracketIcon />
      <p>DRAG</p>
      <p>&</p>
      <p>DROP</p>
    </div>
    <div>
      <div></div>
      <button>스프린트 생성하기</button>
    </div>
  </div>
);

export default SprintBacklogSetting;
