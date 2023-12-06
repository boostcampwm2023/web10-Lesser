import { MouseEventHandler, LegacyRef } from 'react';
import { ProjectCreateButton, ProjectCreateLayout, ProjectCreateTitle } from '.';

interface ProjectFormProps {
  projectFormTitle: string;
  projectFormPlaceholder: string;
  projectButtonText: string;
  projectButtonClickHandler: MouseEventHandler<HTMLButtonElement>;
  projectRef: LegacyRef<HTMLInputElement> | undefined;
}

const ProjectCreateForm = ({
  projectFormTitle,
  projectFormPlaceholder,
  projectButtonText,
  projectButtonClickHandler,
  projectRef,
}: ProjectFormProps) => {
  return (
    <ProjectCreateLayout>
      <ProjectCreateTitle>{projectFormTitle}</ProjectCreateTitle>
      <input
        type="text"
        className="border-starbucks-green border-2 w-[31.25rem] h-10 mx-auto rounded ps-2"
        placeholder={projectFormPlaceholder}
        ref={projectRef}
      />
      <ProjectCreateButton clickHandler={projectButtonClickHandler}>{projectButtonText}</ProjectCreateButton>
    </ProjectCreateLayout>
  );
};

export default ProjectCreateForm;
