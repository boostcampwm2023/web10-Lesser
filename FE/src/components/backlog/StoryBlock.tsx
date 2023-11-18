import { useState } from 'react';
import TaskBlock from './TaskBlock';
import useBlock, { BacklogState } from '../../hooks/useBlock';
import TaskModal from './TaskModal';

interface StoryBlockProps {
  epicIndex: number;
  storyIndex: number;
  backlogState: BacklogState;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
}

const StoryBlock = ({ epicIndex, storyIndex, backlogState, setBacklogState }: StoryBlockProps) => {
  const { formVisibility, handleAddBlock } = useBlock();
  const [storyVisibility, setStoryVisibility] = useState<boolean>(true);

  const handleStoryToggleButton = () => {
    setStoryVisibility(!storyVisibility);
  };

  return (
    <div className="border-2 border-blue-600">
      <div className="flex gap-2">
        <h3>{backlogState.epics[epicIndex].stories[storyIndex].title}</h3>
        <button className="border" onClick={handleStoryToggleButton}>
          Toggle Story
        </button>
      </div>
      {storyVisibility &&
        backlogState.epics[epicIndex].stories[storyIndex].tasks.map((task, index) => (
          <TaskBlock key={index} taskData={task} />
        ))}
      {formVisibility && (
        <TaskModal onClose={handleAddBlock} setBacklogState={setBacklogState} {...{ epicIndex, storyIndex }} />
      )}
      <button className="border px-8" onClick={handleAddBlock}>
        + Task 생성하기
      </button>
    </div>
  );
};

export default StoryBlock;
