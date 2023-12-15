import ChevronDownIcon from '../../assets/icons/ChevronDownIcon';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import useDetail from '../../hooks/pages/backlog/useDetail';

interface KanbanBoardProps {
  storyTitle?: string;
  storyId?: number;
  storySequence?: number;
  children: React.ReactNode;
}

const KanbanBoard = ({ storyTitle, storySequence, children }: KanbanBoardProps) => {
  const { detail, toggleDetail } = useDetail();

  return (
    <div>
      {storyTitle && (
        <button onClick={toggleDetail} className="flex items-center pb-2.5">
          {detail ? <ChevronDownIcon /> : <ChevronRightIcon />}
          <p className="flex items-center gap-2">
            <span className="text-sm font-bold text-starbucks-green">LES-{storySequence}</span>
            <span className="text-xs font-medium ">{storyTitle}</span>
          </p>
        </button>
      )}
      <div className={`${!detail && 'hidden'} flex justify-between gap-8 `}>{children}</div>
    </div>
  );
};

export default KanbanBoard;
