import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { api } from '../../../apis/api';
import TaskForm from '../taskForm/TaskForm';
import { TaskModalProps } from './TaskModal';
import { ReadBacklogTaskResponseDto } from '../../../types/backlog';
import useTaskManager from '../../../hooks/pages/backlog/useTaskManager';

const TaskUpdateModal = ({ close, id, title, userId, point, condition }: TaskModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { taskManagerId, setNewTaskManager } = useTaskManager(Number(userId));
  const getBody = () => {
    if (!formRef.current) return { id, title, userId, point, condition };
    return [...formRef.current.querySelectorAll('input'), formRef.current.querySelector('textarea')].reduce(
      (acc: ReadBacklogTaskResponseDto, cur: HTMLInputElement | HTMLTextAreaElement | null) => {
        if (!cur) return acc;
        const newData = {
          ...acc,
          [cur.id]: cur.id === 'point' ? Number(cur.value) : cur.value,
        };
        return newData;
      },
      { id, userId: taskManagerId } as ReadBacklogTaskResponseDto,
    );
  };
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      return await api.patch('/backlogs/task', getBody());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlogs'] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
    close();
  };

  return (
    <>
      <TaskForm
        close={close}
        handleSubmit={handleSubmit}
        setNewTaskManager={setNewTaskManager}
        formRef={formRef}
        defaultData={{ id, title, userId: taskManagerId, point, condition }}
      />
    </>
  );
};

export default TaskUpdateModal;
