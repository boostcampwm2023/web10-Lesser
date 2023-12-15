import { MouseEventHandler, ReactNode } from 'react';

interface ProjectCreateButtonProps {
  clickHandler: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const ProjectCreateButton = ({ clickHandler, children }: ProjectCreateButtonProps) => {
  return (
    <button
      className="bg-starbucks-green w-[31.25rem] h-10 mx-auto rounded font-pretendard font-bold text-true-white"
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default ProjectCreateButton;
