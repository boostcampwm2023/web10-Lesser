import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../apis/api';

const usePatchTaskState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, state }: { id: number; state: string }) =>
      await api.patch('/backlogs/task', { id, state }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprint'] });
    },
  });
};

export default usePatchTaskState;
