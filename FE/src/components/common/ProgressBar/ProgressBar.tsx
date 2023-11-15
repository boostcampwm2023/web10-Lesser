interface PrograssBarProps {
  startText: string;
  endText: string;
  totalAmount: number;
  currentAmount: number;
}

const PrograssBar = (props: PrograssBarProps) => {
  const { startText, endText, totalAmount, currentAmount } = props;
  const percentage = Number(currentAmount / totalAmount) * 100;

  return (
    <div>
      <span>{startText}</span>
      <div>
        <div>배경바</div>
        <div>{percentage}</div>
      </div>
      <span>{endText}</span>
    </div>
  );
};

export default PrograssBar;
