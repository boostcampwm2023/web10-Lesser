interface DountChartProps {
  percent: number;
}

const DountChart = ({ percent }: DountChartProps) => (
  <svg viewBox="0 0 200 200">
    <circle
      cx="100"
      cy="100"
      r="80"
      fill="none"
      stroke="#006241"
      strokeWidth="30"
      strokeDasharray={`${2 * Math.PI * 80 * percent} ${2 * Math.PI * 80 * (1 - percent)}`}
      strokeDashoffset={2 * Math.PI * 80 * 0.25}
    />
  </svg>
);

export default DountChart;
