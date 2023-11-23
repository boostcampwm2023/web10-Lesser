import { useState } from 'react';
import TaskBlock from './TaskBlock';
import useBlock from '../../hooks/useBlock';
import TaskModal from './TaskModal';
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import PlusIcon from '../../assets/icons/PlusIcon';
import { BacklogState } from '../../types/backlog';
import EditIcon from './../../assets/icons/EditIcon';
import BlockForm from './BlockFrom';

interface StoryBlockProps {
  epicIndex: number;
  storyIndex: number;
  backlogState: BacklogState;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
}

const StoryBlock = ({ epicIndex, storyIndex, backlogState, setBacklogState }: StoryBlockProps) => {
  const storyTitle = backlogState.epics[epicIndex].stories[storyIndex].title;
  const {
    newFormVisible,
    updateFormVisible,
    formRef,
    handleAddBlockButtonClick,
    handleEditBlockButtonClick,
    handleFormSubmit,
  } = useBlock({
    setBlock: setBacklogState,
    epicIndex: epicIndex,
    storyIndex: storyIndex,
  });
  const [storyVisible, setStoryVisibility] = useState<boolean>(true);

  const handleStoryToggleButton = () => {
    setStoryVisibility(!storyVisible);
  };

  return (
    <div className="border border-transparent-green rounded-md bg-cool-neutral ">
      <div className="flex gap-[0.313rem] py-2 px-2.5">
        <button onClick={handleStoryToggleButton}>{storyVisible ? <ChevronDownIcon /> : <ChevronRightIcon />}</button>
        <div className="flex w-full gap-2.5 text-house-green font-bold">
          <span className="flex items-center text-starbucks-green">{`Story${storyIndex + 1}`}</span>
          {updateFormVisible ? (
            <BlockForm
              initialTitle={storyTitle}
              formRef={formRef}
              placeholder="이 기능에서 사용자는 어떤 것을 할 수 있나요? 예시) 사용자는 로그인 할 수 있다"
              handleFormSubmit={(e) => handleFormSubmit(e, 'update', 'stories')}
              onClose={handleEditBlockButtonClick}
            />
          ) : (
            <button
              className="group flex gap-[0.313rem] hover:underline items-center"
              onClick={handleEditBlockButtonClick}
            >
              {storyTitle}
              <span className="hidden group-hover:flex">
                <EditIcon color="text-house-green" size={16} />
              </span>
            </button>
          )}
        </div>
      </div>
      {storyVisible &&
        backlogState.epics[epicIndex].stories[storyIndex].tasks.map((task, taskIndex) => (
          <TaskBlock key={taskIndex} {...{ task, epicIndex, storyIndex, taskIndex, setBacklogState }} />
        ))}
      {newFormVisible && (
        <TaskModal
          onClose={handleAddBlockButtonClick}
          setBacklogState={setBacklogState}
          {...{ epicIndex, storyIndex }}
        />
      )}

      {storyVisible && (
        <button
          className={`flex w-full py-[0.188rem] text-center justify-center border-t font-bold text-light-gray`}
          onClick={handleAddBlockButtonClick}
        >
          <PlusIcon color="text-light-gray" />
          {`Task 생성하기`}
        </button>
      )}
    </div>
  );
};

export default StoryBlock;
