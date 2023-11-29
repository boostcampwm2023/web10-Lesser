import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { date: '2023-01-01', remaining: 10, ideal: 10 },
  { date: '2023-01-02', remaining: 10, ideal: 7.5 },
  { date: '2023-01-03', remaining: 9, ideal: 5 },
  { date: '2023-01-04', remaining: 9, ideal: 2.5 },
  { date: '2023-01-05', remaining: 9, ideal: 0 },
];

const maxYValue = Math.max(...data.map((entry) => entry.ideal));

const ReviewChart = () => (
  <LineChart width={964} height={550} data={data} margin={{ top: 25, left: 5, right: 10 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis dataKey="ideal" domain={[0, maxYValue]} label={{ value: '이슈 개수', angle: -90 }} />
    <Tooltip />
    <Legend />
    <Line type="step" dataKey="remaining" stroke="#8884d8" dot={{ r: 0 }} activeDot={{ r: 5 }} />
    <Line type="linear" dataKey="ideal" stroke="#82ca9d" dot={{ r: 0 }} activeDot={{ r: 0 }} />
  </LineChart>
);

export default ReviewChart;
