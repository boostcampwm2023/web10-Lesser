import { ReactNode } from 'react';

interface ProjectCreateTitleProps {
  children: ReactNode;
}

const ProjectCreateTitle = ({ children }: ProjectCreateTitleProps) => {
  return <p className="text-starbucks-green font-prentendard text-xl font-bold w-[31.25rem] mx-auto">{children}</p>;
};

export default ProjectCreateTitle;
