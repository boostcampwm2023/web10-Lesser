import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../apis/api';

const usePatchTaskState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, state }: { id: number; state: string }) =>
      await api.patch('/backlogs/task', { id, state }),
    onError: () => {
      alert('오류가 발생해 상태를 업데이트하지 못했습니다.');
      queryClient.invalidateQueries({ queryKey: ['sprint'] });
    },
  });
};

export default usePatchTaskState;
