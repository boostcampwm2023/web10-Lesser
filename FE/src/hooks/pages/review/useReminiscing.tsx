import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../apis/api';
import { SelectedSprint } from '../../../types/review';

const useReminiscing = (
  sprint: SelectedSprint,
  content: string,
  setEditTextarea: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      sprint.remi
        ? await api.put('/reviews/remi', { id: sprint.remi.id, content })
        : await api.post('/reviews', { sprintId: sprint.id, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', sprint.id] });
      setEditTextarea(false);
    },
  });

  const handleConfirmButtonClick = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) {
      window.alert('값을 입력해주세요');
      return;
    }
    await mutateAsync();
  };

  return { handleConfirmButtonClick };
};

export default useReminiscing;
