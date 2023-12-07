import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import fetchPostSprint from '../../../apis/sprint/fetchPostSprint';
import { SprintCreateBody } from '../../../types/sprint';

const usePostNewSprint = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (body: SprintCreateBody) => await fetchPostSprint(body),
    onSuccess: () => {
      navigate('/sprint');
    },
  });
};

export default usePostNewSprint;
