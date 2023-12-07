import { useEffect, useState } from 'react';

const useTaskManager = (initialValue?: number) => {
  const [taskManagerId, setTaskManagerId] = useState<number | undefined>(initialValue);

  useEffect(() => {
    console.log('changed', taskManagerId);
  }, [taskManagerId]);

  const setNewTaskManager = (newId: number) => {
    setTaskManagerId(newId);
  };

  return { taskManagerId, setNewTaskManager };
};

export default useTaskManager;
