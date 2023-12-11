import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../apis/api';

interface BacklogPostBody {
  parentId: number;
  title: string;
}

const usePostBacklog = (url: string, getBody: () => BacklogPostBody, toggleButton: () => void) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const response = await api.post(url, getBody());
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlogs'] });
      queryClient.invalidateQueries({ queryKey: ['sprint'] });
    },
  });

  const handleClick = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!getBody().title.trim()) {
      window.alert('값을 입력해주세요');
      return;
    }
    await mutateAsync();
    toggleButton();
  };

  return { handleClick };
};

export default usePostBacklog;
