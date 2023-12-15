interface PrograssBarProps {
  startText: string;
  endText: string;
  totalAmount: number;
  currentAmount: number;
}

const PrograssBar = (props: PrograssBarProps) => {
  const { startText, endText, totalAmount, currentAmount } = props;
  const progress = Math.round((currentAmount / totalAmount) * 11);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold">{startText}</span>
      <div className="relative">
        <div className="h-2 rounded-lg w-[11rem] bg-green-stroke"></div>
        <div className={`absolute top-0 h-2 rounded-lg bg-starbucks-green`} style={{ width: ` ${progress}rem` }}></div>
      </div>
      <span className="text-xs font-bold">{endText}</span>
    </div>
  );
};

export default PrograssBar;
