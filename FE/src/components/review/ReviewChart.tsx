import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SelectedSprint } from '../../types/review';
import { transformDate } from '../../utils/date';
interface TaskList {
  completedAt: string;
  condition: string;
  id: number;
  userId: string;
  point: number;
}

const createChartData = (startDate: string, endDate: string, taskList: TaskList[]) => {
  const chartData = [];
  const taskCount = taskList.length;
  const dateCount = (Number(new Date(endDate)) - Number(new Date(startDate))) / (24 * 60 * 60 * 1000);
  const tasksPerDay = taskCount / dateCount;
  const currentDate = new Date(startDate);
  const completedTask = taskList.filter((task) => task.completedAt);
  let ideal = taskList.length;
  let remaining = taskList.length;

  while (currentDate <= new Date(endDate)) {
    if (completedTask.some((task) => new Date(task.completedAt).toString() === currentDate.toString())) {
      remaining -= 1;
    }

    chartData.push({ date: transformDate(currentDate.toString()), ideal: ideal.toFixed(3), remaining });
    currentDate.setDate(currentDate.getDate() + 1);
    ideal -= tasksPerDay;
  }

  return chartData;
};

const ReviewChart = (sprint: SelectedSprint) => {
  const chartData = createChartData(sprint.startDate!, sprint.endDate!, sprint.taskList!);
  const taskCount = sprint.taskList!.length;

  return (
    <LineChart width={964} height={550} data={chartData} margin={{ top: 25, left: 5, right: 10 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" interval={Math.ceil(chartData.length / 10)} />
      <YAxis
        dataKey="ideal"
        domain={[0, taskCount]}
        label={{ value: '태스크 개수', angle: -90, position: 'insideLeft' }}
      />
      <Tooltip />
      <Legend />
      <Line type="step" dataKey="remaining" stroke="#8884d8" dot={{ r: 0 }} activeDot={{ r: 5 }} />
      <Line type="linear" dataKey="ideal" stroke="#82ca9d" dot={{ r: 0 }} activeDot={{ r: 0 }} />
    </LineChart>
  );
};

export default ReviewChart;
