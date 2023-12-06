import { CLIENT_URL } from '../../constants/constants';
import { useNewProjectSubject, useNewProjectTitle, useProjectCreateProcess } from '../../hooks/pages/project';
import { ProjectCreateForm, ProjectInviteForm } from '../../components/project';
import { CreateProcessText, CreateProcessHeader } from '../../components/common/CreateProcess';

const ProjectCreatePage = () => {
  const { process, setNextProcess } = useProjectCreateProcess();
  const { projectTitle, projectTitleRef, handleTitleButtonClick } = useNewProjectTitle(setNextProcess);
  const { projectSubject, projectSubjectRef, handleSubjectButtonClick } = useNewProjectSubject(setNextProcess);
  return (
    <>
      <CreateProcessHeader backLink={CLIENT_URL.PROJECT}>
        <CreateProcessText processNum={1} processName="프로젝트 이름" active={process >= 0} />
        <CreateProcessText processNum={2} processName="프로젝트 주제" active={process >= 1} />
        <CreateProcessText processNum={3} processName="멤버 초대하기" active={process >= 2} />
      </CreateProcessHeader>
      {process === 0 ? (
        <ProjectCreateForm
          projectFormTitle="프로젝트 이름이 무엇인가요?"
          projectFormPlaceholder="프로젝트 이름"
          projectButtonText="다음으로"
          projectButtonClickHandler={handleTitleButtonClick}
          projectRef={projectTitleRef}
        />
      ) : process === 1 ? (
        <ProjectCreateForm
          projectFormTitle="프로젝트 주제가 무엇인가요?"
          projectFormPlaceholder="프로젝트 주제"
          projectButtonText="프로젝트 생성하기"
          projectButtonClickHandler={handleSubjectButtonClick}
          projectRef={projectSubjectRef}
        />
      ) : (
        <ProjectInviteForm projectTitle={projectTitle} projectSubject={projectSubject} />
      )}
    </>
  );
};

export default ProjectCreatePage;
