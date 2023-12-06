import { ProjectUser } from '../../../types/project';
import { usePostNewProject } from '../../queries/project';

interface UseCreateNewProjectProps {
  projectTitle: string;
  projectSubject: string;
  userList: ProjectUser[];
}

const useCreateNewProject = ({ projectTitle, projectSubject, userList }: UseCreateNewProjectProps) => {
  const { mutateAsync } = usePostNewProject(userList);
  const memberList = userList.map((user) => user.userId);
  const handleCreateButtonClick = async () => {
    const body = {
      name: projectTitle,
      subject: projectSubject,
      memberList,
    };
    await mutateAsync(body);
  };

  return { handleCreateButtonClick };
};

export default useCreateNewProject;
