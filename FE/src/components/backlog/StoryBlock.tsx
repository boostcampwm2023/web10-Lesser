import { useState } from 'react';
import TaskBlock from './TaskBlock';
import TaskModal, { TaskData } from './TaskModal';

interface StoryBlockProps {
  storyTitle: string;
}

const StoryBlock = ({ storyTitle }: StoryBlockProps) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [showStory, setShowStory] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleToggleStory = () => {
    setShowStory(!showStory);
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleTaskCreate = (taskData: TaskData) => {
    setTasks((prevTasks) => [...prevTasks, taskData]);
  };

  return (
    <div className="border-2 border-blue-600">
      <div className="flex gap-2">
        <h3>{storyTitle}</h3>
        <button className="border" onClick={handleToggleStory}>
          Toggle Story
        </button>
      </div>
      {showStory && tasks.map((task, index) => <TaskBlock key={index} taskData={task} />)}
      {showModal && <TaskModal onClose={handleToggleModal} onTaskCreate={handleTaskCreate} />}
      <button className="border px-8" onClick={handleToggleModal}>
        + Task 생성하기
      </button>
    </div>
  );
};

export default StoryBlock;
