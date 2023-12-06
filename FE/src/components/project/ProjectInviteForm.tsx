import { useCreateNewProject, useSearchUsername } from '../../hooks/pages/project';
import { ProjectCreateButton, ProjectCreateLayout, ProjectCreateTitle } from '.';
import ClosedIcon from '../../assets/icons/ClosedIcon';

interface ProjectInviteFormProps {
  projectTitle: string;
  projectSubject: string;
}

const ProjectInviteForm = ({ projectTitle, projectSubject }: ProjectInviteFormProps) => {
  const { userList, usernameInputRef, handleSearchClick, handleDeleteClick } = useSearchUsername();
  const { handleCreateButtonClick } = useCreateNewProject({ projectTitle, projectSubject, userList });
  return (
    <ProjectCreateLayout>
      <ProjectCreateTitle>프로젝트 멤버는 누구인가요?</ProjectCreateTitle>
      <div className="flex mx-auto gap-4 w-[31.25rem]">
        <input
          type="text"
          className="border-starbucks-green border-2 w-full h-10 mx-auto rounded ps-2"
          placeholder="초대하려는 사용자의 닉네임을 검색하세요"
          ref={usernameInputRef}
        />
        <button
          className="bg-starbucks-green text-true-white w-16 h-10 rounded text-center"
          onClick={handleSearchClick}
        >
          검색
        </button>
      </div>
      <div className="flex flex-wrap w-[31.25rem] mx-auto">
        {userList.map((user) => (
          <div
            key={user.userId}
            className="flex gap-1 h-7 text-true-white bg-house-green font-bold text-xs rounded-lg items-center ps-2 pe-1"
          >
            <span>{user.userName}</span>
            <button id={user.userId.toString()} onClick={handleDeleteClick}>
              <ClosedIcon color="true-white" />
            </button>
          </div>
        ))}
      </div>
      <ProjectCreateButton clickHandler={handleCreateButtonClick}>프로젝트 생성하기</ProjectCreateButton>
    </ProjectCreateLayout>
  );
};

export default ProjectInviteForm;
