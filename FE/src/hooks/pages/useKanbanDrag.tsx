import { Task, TaskState } from '../../types/sprint';

const useKanbanDrag = (setTaskList: React.Dispatch<React.SetStateAction<Task[]>>) => {
  const handleDragStart = (e: React.DragEvent, id: number, storyId: number) => {
    e.dataTransfer.setData('taskData', JSON.stringify({ id, storyId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragDrop = (e: React.DragEvent, state: TaskState, boardStoryId: number | undefined = undefined) => {
    const taskData = e.dataTransfer.getData('taskData');

    if (!taskData) {
      return;
    }

    const { id: taskId, storyId } = JSON.parse(e.dataTransfer.getData('taskData'));

    if (boardStoryId && storyId !== boardStoryId) {
      return;
    }

    setTaskList((taskList: Task[]) => {
      const targetTask = taskList.filter(({ id }) => id === taskId)[0];
      targetTask.state = state;
      return [...taskList.filter(({ id }) => id !== taskId), targetTask];
    });
  };

  return { handleDragDrop, handleDragStart, handleDragOver };
};

export default useKanbanDrag;
