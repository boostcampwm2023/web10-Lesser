import { ReactNode } from 'react';

interface ProjectCreateLayoutProps {
  children: ReactNode;
}

const ProjectCreateLayout = ({ children }: ProjectCreateLayoutProps) => {
  return (
    <div className="flex flex-col max-w-[76rem] min-w-[76rem] mx-auto my-auto gap-6 mt-[calc(50vh-150px)]">
      {children}
    </div>
  );
};

export default ProjectCreateLayout;
