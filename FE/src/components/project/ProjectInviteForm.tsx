import { ProjectCreateButton, ProjectCreateLayout, ProjectCreateTitle } from '.';

const ProjectInviteForm = () => {
  const tempClickHandler = () => {
    console.log('this is temporary button click handler');
  };
  return (
    <ProjectCreateLayout>
      <ProjectCreateTitle>프로젝트 멤버는 누구인가요?</ProjectCreateTitle>
      <ProjectCreateButton clickHandler={tempClickHandler}>프로젝트 생성하기</ProjectCreateButton>
    </ProjectCreateLayout>
  );
};

export default ProjectInviteForm;
