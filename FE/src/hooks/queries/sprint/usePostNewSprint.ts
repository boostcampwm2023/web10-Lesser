import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import fetchPostSprint from '../../../apis/sprint/fetchPostSprint';
import { SprintCreateBody } from '../../../types/sprint';

const usePostNewSprint = (projectId: number) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (body: SprintCreateBody) => await fetchPostSprint(body),
    onSuccess: () => {
      navigate(`/projects/${projectId}/sprint`);
    },
  });
};

export default usePostNewSprint;
