import { ReactElement } from 'react';
import useDetail from '../../hooks/pages/backlog/useDetail';
import { useModal } from '../../modal/useModal';
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import BacklogTitle from './BacklogTitle';
import TaskPostModal from './Modal/TaskPostModal';
import PlusIcon from '../../assets/icons/PlusIcon';

interface StoryComponentProps {
  title: string;
  id: number;
  children: ReactElement;
  sequence: number;
  point: { TOTAL: number; REMAIN: number };
}

const StoryComponent = ({ title, id, children, sequence, point }: StoryComponentProps) => {
  const { detail, toggleDetail } = useDetail();
  const { open, close } = useModal();

  return (
    <div className="border border-transparent-green rounded-md bg-cool-neutral ">
      <div className="flex gap-1 py-2 px-2.5">
        <button onClick={toggleDetail}>{detail ? <ChevronDownIcon /> : <ChevronRightIcon />}</button>
        <div className="flex w-full gap-2.5 text-house-green font-bold items-center">
          <p className="text-starbucks-green">Story{sequence}</p>
          <BacklogTitle title={title} id={id} url="/story" />
          <div className="flex gap-1 text-starbucks-green font-bold">
            <p>{point.REMAIN}</p>
            {/* <p>POINT</p> */}
            <p>/</p>
            <p>{point.TOTAL}</p>
            <p>POINT</p>
          </div>
        </div>
      </div>
      <div className={`${!detail && 'hidden'}`}>
        {children}
        <button
          className="flex w-full py-1 text-center justify-center border-t font-bold text-light-gray"
          onClick={() => {
            open(<TaskPostModal close={close} parentId={id} />);
          }}
        >
          <PlusIcon color="text-light-gray" />
          <p className="items-center">task 생성하기</p>
        </button>
      </div>
    </div>
  );
};

export default StoryComponent;
