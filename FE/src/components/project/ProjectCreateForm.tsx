import { MouseEventHandler } from 'react';

interface ProjectFormProps {
  projectFormTitle: string;
  projectFormPlaceholder: string;
  projectButtonText: string;
  projectButtonClickHandler: MouseEventHandler<HTMLButtonElement>;
}

const ProjectCreateForm = ({
  projectFormTitle,
  projectFormPlaceholder,
  projectButtonText,
  projectButtonClickHandler,
}: ProjectFormProps) => {
  return (
    <div className="flex flex-col max-w-[76rem] min-w-[76rem] mx-auto my-auto gap-6 mt-[calc(50vh-150px)]">
      <p className="text-starbucks-green font-prentendard text-xl font-bold w-[31.25rem] mx-auto">{projectFormTitle}</p>
      <input
        type="text"
        className="border-starbucks-green border-2 w-[31.25rem] h-10 mx-auto rounded ps-2"
        placeholder={projectFormPlaceholder}
      />
      <button
        className="bg-starbucks-green w-[31.25rem] h-10 mx-auto rounded font-pretendard font-bold text-true-white"
        onClick={projectButtonClickHandler}
      >
        {projectButtonText}
      </button>
    </div>
  );
};

export default ProjectCreateForm;
