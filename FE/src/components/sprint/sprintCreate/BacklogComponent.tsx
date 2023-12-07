import { Draggable, Droppable } from 'react-beautiful-dnd';
import {
  ReadBacklogEpicResponseDto,
  ReadBacklogStoryResponseDto,
  ReadBacklogTaskResponseDto,
} from '../../../types/backlog';
import EpicComponent from '../../backlog/EpicComponent';
import StoryComponent from '../../backlog/StoryComponent';
import PostButton from '../../backlog/PostButton';
import SprintBacklogTask from './SprintBacklogTask';

interface BacklogComponentProps {
  backlog: { epicList: ReadBacklogEpicResponseDto[] };
}

const BacklogComponent = ({ backlog }: BacklogComponentProps) => (
  <div className="min-w-[36.25rem] flex flex-col gap-4 mb-8">
    {backlog.epicList.map((epic: ReadBacklogEpicResponseDto, epicIndex) => (
      <EpicComponent title={epic.title} id={epic.id} sequence={epic.sequence} key={`EPIC${epic.id}`}>
        <>
          {epic.storyList.map((story: ReadBacklogStoryResponseDto, storyIndex) => (
            <Droppable droppableId={`${epicIndex} ${storyIndex}`} key={`STORY${story.id}`} isDropDisabled={true}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <StoryComponent title={story.title} id={story.id} sequence={story.sequence}>
                    <>
                      {story.taskList.map((task: ReadBacklogTaskResponseDto, index) => (
                        <Draggable draggableId={`${task.id}`} index={index} key={`TASK${task.id}`}>
                          {(provided) => (
                            <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                              <SprintBacklogTask {...task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </>
                  </StoryComponent>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
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
);

export default BacklogComponent;
