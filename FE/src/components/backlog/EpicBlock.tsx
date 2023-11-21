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
    newBlockTitle,
    updateBlockTitle,
    isNewFormVisible,
    formRef,
    handleAddBlockButtonClick,
    handleFormSubmit,
    setNewBlockTitle,
    setUpdateBlockTitle,
  } = useBlock({
    currentBlock: 'stories',
    setBlock: setBacklogState,
    epicIndex: epicIndex,
    initailTitle: epicTitle,
  });
  const [isEpicVisible, setEpicVisibility] = useState<boolean>(true);
  const [isEditorVisible, setEditorVisibility] = useState<boolean>(false);
  const handleEpicToggleButtonClick = () => {
    setEpicVisibility(!isEpicVisible);
  };
  const handleEditButtonClick = () => {
    setEditorVisibility(!isEditorVisible);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-house-green rounded-md">
      <div className="flex gap-2">
        <button onClick={handleEpicToggleButtonClick}>
          {isEpicVisible ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
        <div className="flex w-full gap-3 text-house-green font-bold">
          <span className="text-l">{`Epic${epicIndex + 1}`}</span>
          {isEditorVisible ? (
            <BlockForm
              formRef={formRef}
              newBlockTitle={updateBlockTitle}
              setNewBlockTitle={setUpdateBlockTitle}
              handleFormSubmit={(e) => handleFormSubmit(e, 'update')}
              onClose={handleEditButtonClick}
              currentBlock="Story"
            />
          ) : (
            <button className="group flex gap-1 hover:underline items-center" onClick={handleEditButtonClick}>
              {epicTitle}
              <span className="hidden group-hover:flex">
                <EditIcon color="text-house-green" size={16} />
              </span>
            </button>
          )}
        </div>
      </div>
      {isEpicVisible &&
        backlogState.epics[epicIndex].stories.map((story, storyIndex) => (
          <StoryBlock
            key={story.title}
            {...{ epicIndex, storyIndex }}
            backlogState={backlogState}
            setBacklogState={setBacklogState}
          />
        ))}

      {isNewFormVisible ? (
        <BlockForm
          formRef={formRef}
          newBlockTitle={newBlockTitle}
          setNewBlockTitle={setNewBlockTitle}
          handleFormSubmit={(e) => handleFormSubmit(e, 'add')}
          onClose={handleAddBlockButtonClick}
          currentBlock="Story"
        />
      ) : (
        <button
          className={`flex w-full py-1 rounded-md text-center justify-center bg-accent-green font-bold text-true-white`}
          onClick={handleAddBlockButtonClick}
        >
          <PlusIcon color="text-true-white" />
          {`Story 생성하기`}
        </button>
      )}
    </div>
  );
};

export default EpicBlock;
