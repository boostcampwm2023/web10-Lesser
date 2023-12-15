import { Link } from 'react-router-dom';
import chevronLeft from '../../../assets/icons/chevron-left.svg';
import { ReactNode } from 'react';

interface CreateProcessHeaderProps {
  backLink: string;
  children: ReactNode;
}

const CreateProcessHeader = ({ backLink, children }: CreateProcessHeaderProps) => (
  <header className="min-w-[76rem] max-w-[76rem] gap-3 flex justify-between mx-auto pe-[6rem] pt-8">
    <Link to={backLink} className="cursor-pointer flex gap-1 w-[6rem]">
      <img src={chevronLeft} />
      <p className="text-sm items-center my-auto">돌아가기</p>
    </Link>
    <div className="flex gap-[5rem] m-auto">{children}</div>
  </header>
);

export default CreateProcessHeader;
