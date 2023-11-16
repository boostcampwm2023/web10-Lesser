interface BaordHeaderProps {
  boardName: string;
  taskNumber: number;
  boardDescription: string;
}
const BoardHeader = ({ boardName, taskNumber, boardDescription }: BaordHeaderProps) => (
  <div className="w-72 px-2.5 mb-2.5">
    <p className="flex justify-between text-2xl font-bold text-house-green">
      <span>{boardName}</span>
      <span>{taskNumber}</span>
    </p>
    <p className="text-xs font-medium">{boardDescription}</p>
  </div>
);

export default BoardHeader;
