import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { api } from '../../../apis/api';
import TaskForm from '../TaskForm';
import useTaskManager from '../../../hooks/pages/backlog/useTaskManager';

interface TaskPostModalProps {
  parentId: number;
  close: () => void;
}

interface TaskPostBody {
  parentId: number;
  title: string;
  userId: string | number;
  point: number;
  condition: string;
}

const TaskPostModal = ({ parentId, close }: TaskPostModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { taskManagerId, handleClickTaskManager } = useTaskManager();
  const getBody = () => {
    if (!formRef.current) return { parentId, title: '', userId: '', point: 0, condition: '' } as TaskPostBody;
    return [...formRef.current.querySelectorAll('input'), formRef.current.querySelector('textarea')].reduce(
      (acc: TaskPostBody, cur: HTMLInputElement | HTMLTextAreaElement | null) => {
        if (!cur) return acc;
        const newData = {
          ...acc,
          [cur.id]: cur.id === 'point' ? Number(cur.value) : cur.value,
        };
        return newData;
      },
      { parentId, userId: taskManagerId } as TaskPostBody,
    );
  };
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      return await api.post('/backlogs/task', getBody());
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
    close();
  };

  return (
    <>
      <TaskForm close={close} handleSubmit={handleSubmit} formRef={formRef} />
    </>
  );
};

export default TaskPostModal;
