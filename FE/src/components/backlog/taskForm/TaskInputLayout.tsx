import { ReactNode } from 'react';

interface TaskInputLayoutProps {
  title: string;
  description: string;
  htmlFor: string;
  children: ReactNode;
}

const TaskInputLayout = ({ title, description, htmlFor, children }: TaskInputLayoutProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-s" htmlFor={htmlFor}>
        <span className="text-m font-bold pr-2">{title}</span>
        <span>{description}</span>
      </label>
      {children}
    </div>
  );
};

export default TaskInputLayout;
