import { Link } from 'react-router-dom';
import chevronLeft from '../assets/icons/chevron-left.svg';
import ProjectProcessText from '../components/project/ProjectProcessText';
import ProjectCreateForm from '../components/project/ProjectCreateForm';
import useProjectForm from '../hooks/useProjectForm';

const ProjectCreatePage = () => {
  const { process, handleNextButtonClick, handleSubmitButtonClick, projectNameRef, projectSubjectRef } =
    useProjectForm();

  return (
    <>
      <div className="min-w-[76rem] max-w-[76rem] gap-3 flex justify-between mx-auto pe-[6rem] pt-8">
        <Link to={'/project'} className="cursor-pointer flex gap-1 w-[6rem]">
          <img src={chevronLeft} />
          <p className="text-sm items-center my-auto">돌아가기</p>
        </Link>
        <div className="flex gap-[5rem] m-auto">
          <ProjectProcessText processNum={1} processName="프로젝트 이름" active={process >= 0} />
          <ProjectProcessText processNum={2} processName="프로젝트 주제" active={process >= 1} />
        </div>
      </div>
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
