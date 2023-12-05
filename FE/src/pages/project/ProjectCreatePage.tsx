import ProjectCreateForm from '../../components/project/ProjectCreateForm';
import useProjectForm from '../../hooks/pages/project/useProjectForm';
import { CreateProcessText, CreateProcessHeader } from '../../components/common/CreateProcess';

const ProjectCreatePage = () => {
  const { process, handleNextButtonClick, handleSubmitButtonClick, projectNameRef, projectSubjectRef } =
    useProjectForm();

  return (
    <>
      <CreateProcessHeader backLink="/project">
        <CreateProcessText processNum={1} processName="프로젝트 이름" active={process >= 0} />
        <CreateProcessText processNum={2} processName="프로젝트 주제" active={process >= 1} />
        <CreateProcessText processNum={3} processName="프로젝트 주제" active={process >= 1} />
      </CreateProcessHeader>
      {!process ? (
        <ProjectCreateForm
          projectFormTitle="프로젝트 이름이 무엇인가요?"
          projectFormPlaceholder="프로젝트 이름"
          projectButtonText="다음으로"
          projectButtonClickHandler={handleNextButtonClick}
          projectRef={projectNameRef}
        />
      ) : (
        <ProjectCreateForm
          projectFormTitle="프로젝트 주제가 무엇인가요?"
          projectFormPlaceholder="프로젝트 주제"
          projectButtonText="프로젝트 생성하기"
          projectButtonClickHandler={handleSubmitButtonClick}
          projectRef={projectSubjectRef}
        />
      )}
    </>
  );
};

export default ProjectCreatePage;
