interface KanbanBoardProps {
  storyTitle?: string;
  storyId?: number;
  storyNumber?: number;
  children: React.ReactNode;
}

const KanbanBoard = ({ storyTitle, storyNumber, children }: KanbanBoardProps) => (
  <div>
    {storyTitle && (
      <p className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-bold text-starbucks-green">LES-{storyNumber}</span>
        <span className="text-xs font-medium ">{storyTitle}</span>
      </p>
    )}
    <div className="flex justify-between gap-8">{children}</div>
  </div>
);

export default KanbanBoard;
