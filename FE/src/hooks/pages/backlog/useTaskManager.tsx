import { useState } from 'react';

const useTaskManager = (initialValue?: number) => {
  const [taskManagerId, setTaskManagerId] = useState<number | undefined>(initialValue);

  const handleTaskManagerClick = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    setTaskManagerId(() => Number(currentTarget.id));
  };
  return { taskManagerId, handleTaskManagerClick };
};

export default useTaskManager;
