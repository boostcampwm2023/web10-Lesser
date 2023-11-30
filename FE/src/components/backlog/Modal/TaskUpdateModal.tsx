import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { api } from '../../../apis/api';
import TaskForm from '../TaskForm';

interface TaskUpdateModalProps {
  close: () => void;
  defaultData: TaskUpdateBody;
}

interface TaskUpdateBody {
  id: number;
  title: string;
  userId: string;
  point: number;
  condition: string;
}

const TaskUpdateModal = ({ close, defaultData }: TaskUpdateModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const getBody = () => {
    if (!formRef.current) return defaultData as TaskUpdateBody;
    return [...formRef.current.querySelectorAll('input'), formRef.current.querySelector('textarea')].reduce(
      (acc: TaskUpdateBody, cur: HTMLInputElement | HTMLTextAreaElement | null) => {
        if (!cur) return acc;
        const newData = {
          ...acc,
          [cur.id]: cur.id === 'point' || cur.id === 'userId' ? Number(cur.value) : cur.value,
        };
        return newData;
      },
      { id: defaultData.id } as TaskUpdateBody,
    );
  };
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      return await api.patch('/backlogs/task', getBody());
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
      <TaskForm close={close} handleSubmit={handleSubmit} formRef={formRef} defaultData={defaultData} />
    </>
  );
};

export default TaskUpdateModal;
