import { useMutation } from '@tanstack/react-query';
import { useSelectedProjectState } from '../../../stores';
import { ProjectUser } from '../../../types/project';
import { useNavigate } from 'react-router-dom';
import { CLIENT_URL } from '../../../constants/constants';
import fetchPostProject from '../../../apis/project/fetchPostProject';

const usePostNewProject = (userList: ProjectUser[]) => {
  const updateProjectData = useSelectedProjectState((state) => state.updateProjectData);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetchPostProject,
    onSuccess: (data) => {
      const NEXT_URL = `${CLIENT_URL.BACKLOG}/${data}`;
      updateProjectData({ id: data, userList });
      navigate(NEXT_URL);
    },
  });
};

export default usePostNewProject;
