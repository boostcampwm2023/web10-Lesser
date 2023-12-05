import { ReactElement } from 'react';
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import useDetail from '../../hooks/pages/backlog/useDetail';
import PostButton from './PostButton';
import BacklogTitle from './BacklogTitle';

interface EpicComponentProps {
  title: string;
  id: number;
  children: ReactElement;
  sequence: number;
}

const EpicComponent = ({ title, id, children, sequence }: EpicComponentProps) => {
  const { detail, toggleDetail } = useDetail();

  return (
    <div className="flex flex-col gap-4 py-3 px-3 border border-house-green rounded-md">
      <div className="flex gap-1 items-center">
        <button onClick={toggleDetail}>{detail ? <ChevronDownIcon /> : <ChevronRightIcon />}</button>
        <div className="flex gap-2 w-full text-house-green font-bold">
          <p className="text-l">Epic{sequence}</p>
          <BacklogTitle title={title} id={id} url="/epic" />
        </div>
      </div>
      <div className={`${!detail && 'hidden'} flex flex-col gap-5`}>
        {children}
        <PostButton
          title="Story 생성하기"
          placeholder="이 기능에서 사용자는 어떤 것을 할 수 있나요? 예시) 사용자는 로그인 할 수 있다"
          color="bg-starbucks-green"
          url="/backlogs/story"
          id={id}
        />
      </div>
    </div>
  );
};
export default EpicComponent;
