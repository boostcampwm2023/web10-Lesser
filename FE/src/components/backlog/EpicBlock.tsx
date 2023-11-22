import { useState } from 'react';
import useBlock from '../../hooks/useBlock';
import StoryBlock from './StoryBlock';
import BlockForm from './BlockFrom';
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import { BacklogState } from '../../types/backlog';
import EditIcon from '../../assets/icons/EditIcon';
import PlusIcon from '../../assets/icons/PlusIcon';

interface EpicBlockProps {
  epicIndex: number;
  backlogState: BacklogState;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
}

const EpicBlock = ({ epicIndex, backlogState, setBacklogState }: EpicBlockProps) => {
  const epicTitle = backlogState.epics[epicIndex].title;
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
  });
  const [epicVisible, setEpicVisibility] = useState<boolean>(true);

  const handleEpicToggleButtonClick = () => {
    setEpicVisibility(!epicVisible);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-house-green rounded-md">
      <div className="flex gap-2">
        <button onClick={handleEpicToggleButtonClick}>
          {epicVisible ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
        <div className="flex w-full gap-3 text-house-green font-bold">
          <span className="text-l">{`Epic${epicIndex + 1}`}</span>
          {updateFormVisible ? (
            <BlockForm
              currentBlock="epic"
              initialTitle={epicTitle}
              formRef={formRef}
              handleFormSubmit={(e) => handleFormSubmit(e, 'update', 'epics')}
              onClose={handleEditBlockButtonClick}
            />
          ) : (
            <button className="group flex gap-1 hover:underline items-center" onClick={handleEditBlockButtonClick}>
              {epicTitle}
              <span className="hidden group-hover:flex">
                <EditIcon color="text-house-green" size={16} />
              </span>
            </button>
          )}
        </div>
      </div>
      {epicVisible &&
        backlogState.epics[epicIndex].stories.map((story, storyIndex) => (
          <StoryBlock
            key={story.title}
            {...{ epicIndex, storyIndex }}
            backlogState={backlogState}
            setBacklogState={setBacklogState}
          />
        ))}

      {epicVisible &&
        (newFormVisible ? (
          <BlockForm
            currentBlock="story"
            initialTitle=""
            formRef={formRef}
            handleFormSubmit={(e) => handleFormSubmit(e, 'add', 'stories')}
            onClose={handleAddBlockButtonClick}
          />
        ) : (
          <button
            className={`flex w-full py-1 rounded-md text-center justify-center bg-accent-green font-bold text-true-white`}
            onClick={handleAddBlockButtonClick}
          >
            <PlusIcon color="text-true-white" />
            {`Story 생성하기`}
          </button>
        ))}
    </div>
  );
};

export default EpicBlock;
