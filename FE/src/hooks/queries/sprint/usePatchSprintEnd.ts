import { useMutation } from '@tanstack/react-query';
import fetchPatchSprintEnd from '../../../apis/sprint/fetchPatchSprintEnd';
import { useNavigate } from 'react-router-dom';

const usePatchSprintEnd = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: number) => await fetchPatchSprintEnd(id),
    onSuccess: () => {
      navigate('/review/sprint');
    },
  });
};

export default usePatchSprintEnd;
