import { ReactNode } from 'react';

interface TaskModalItemLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

const TaskModalItemLayout = ({ children, title, description }: TaskModalItemLayoutProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-m font-bold pr-2">{title}</span>
        <span className="text-s">{description}</span>
      </div>
      {children}
    </div>
  );
};

export default TaskModalItemLayout;
