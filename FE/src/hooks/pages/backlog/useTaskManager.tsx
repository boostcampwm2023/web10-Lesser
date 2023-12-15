import { useState } from 'react';

const useTaskManager = (initialValue?: number | null) => {
  const [taskManagerId, setTaskManagerId] = useState<number | null>(initialValue ?? null);

  const setNewTaskManager = (newId: number | null) => {
    if (!newId) {
      setTaskManagerId(null);
      return;
    }
    setTaskManagerId(newId);
  };

  return { taskManagerId, setNewTaskManager };
};

export default useTaskManager;
