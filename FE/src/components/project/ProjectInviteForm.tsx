import { useCreateNewProject, useSearchUsername } from '../../hooks/pages/project';
import { ProjectCreateButton, ProjectCreateLayout, ProjectCreateTitle } from '.';

interface ProjectInviteFormProps {
  projectTitle: string;
  projectSubject: string;
}

const ProjectInviteForm = ({ projectTitle, projectSubject }: ProjectInviteFormProps) => {
  const { userList, usernameSearchbar, handleSearchClick, handleDeleteClick } = useSearchUsername();
  const { handleCreateButtonClick } = useCreateNewProject({ projectTitle, projectSubject, userList });
  return (
    <ProjectCreateLayout>
      <ProjectCreateTitle>프로젝트 멤버는 누구인가요?</ProjectCreateTitle>
      <div className="flex">
        <input type="text" ref={usernameSearchbar} />
        <button onClick={handleSearchClick}>검색</button>
      </div>
      {userList.map((user) => (
        <div key={user.userId}>
          <span>{user.userName}</span>
          <span>{user.userId}</span>
          <button id={user.userId.toString()} onClick={handleDeleteClick}>
            삭제
          </button>
        </div>
      ))}
      <ProjectCreateButton clickHandler={handleCreateButtonClick}>프로젝트 생성하기</ProjectCreateButton>
    </ProjectCreateLayout>
  );
};

export default ProjectInviteForm;
