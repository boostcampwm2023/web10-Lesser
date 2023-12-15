interface DountChartProps {
  percent: number;
}

const DountChart = ({ percent }: DountChartProps) => (
  <svg viewBox="0 0 200 200">
    {percent === 0 || isNaN(percent) ? (
      <text x="50" y="110" fontSize="30" fill="gray">
        No data
      </text>
    ) : (
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="#006241"
        strokeWidth="30"
        strokeDasharray={`${(2 * Math.PI * 80 * percent) / 100} ${2 * Math.PI * 80 * (1 - percent / 100)}`}
        strokeDashoffset={2 * Math.PI * 80 * 0.25}
      />
    )}
  </svg>
);

export default DountChart;
