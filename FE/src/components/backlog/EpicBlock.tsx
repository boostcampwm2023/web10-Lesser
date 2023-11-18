import { useState } from 'react';
import useBlock, { BacklogState } from '../../hooks/useBlock';
import StoryBlock from './StoryBlock';
import BlockForm from './BlockFrom';

interface EpicBlockProps {
  epicIndex: number;
  backlogState: BacklogState;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
}

const EpicBlock = ({ epicIndex, backlogState, setBacklogState }: EpicBlockProps) => {
  const { newBlockTitle, formVisibility, formRef, handleAddBlock, handleFormSubmit, setNewBlockTitle } = useBlock({
    currentBlock: 'stories',
    setBlock: setBacklogState,
    epicIndex: epicIndex,
  });
  const [epicVisibility, setEpicVisibility] = useState<boolean>(true);
  const handleEpicToggleButton = () => {
    setEpicVisibility(!epicVisibility);
  };

  return (
    <div className="my-5 border-2 border-red-600">
      <div className="flex gap-2">
        <h2>{backlogState.epics[epicIndex].title}</h2>
        <button className="border" onClick={handleEpicToggleButton}>
          Toggle Epic
        </button>
      </div>
      {epicVisibility &&
        backlogState.epics[epicIndex].stories.map((story, storyIndex) => (
          <StoryBlock
            key={story.title}
            {...{ epicIndex, storyIndex }}
            backlogState={backlogState}
            setBacklogState={setBacklogState}
          />
        ))}
      <BlockForm
        formRef={formRef}
        newBlockTitle={newBlockTitle}
        setNewBlockTitle={setNewBlockTitle}
        formVisibility={formVisibility}
        handleFormSubmit={handleFormSubmit}
        handleAddBlock={handleAddBlock}
        buttonText="+ Story 생성하기"
      />
    </div>
  );
};

export default EpicBlock;
