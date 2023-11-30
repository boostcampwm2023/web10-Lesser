import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../apis/api';

interface BacklogUpdateBody {
  id: number;
  title: string;
}

const useUpdateBacklog = (url: string, getBody: () => BacklogUpdateBody, toggleButton: () => void) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/backlogs${url}`, getBody());
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlogs', 1] });
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

export default useUpdateBacklog;
