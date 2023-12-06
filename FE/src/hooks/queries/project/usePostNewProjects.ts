import { useMutation } from '@tanstack/react-query';
import { fetchPostProject } from '../../../apis/project';
import { useNavigate } from 'react-router-dom';
import { CLIENT_URL } from '../../../constants/constants';

const usePostNewProject = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetchPostProject,
    onSuccess: (data) => {
      // const NEXT_URL = `${CLIENT_URL.BACKLOG}/`
      console.log(data);
    },
  });
};
