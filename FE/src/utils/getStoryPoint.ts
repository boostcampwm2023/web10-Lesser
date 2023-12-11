import { ReadBacklogTaskResponseDto } from '../types/backlog';

const getStoryPoint = (taskList: ReadBacklogTaskResponseDto[]) => ({
  TOTAL: taskList.reduce((acc: number, cur: ReadBacklogTaskResponseDto) => acc + cur.point, 0),
  REMAIN: taskList.reduce(
    (acc: number, cur: ReadBacklogTaskResponseDto) => (acc + cur.state !== 'Done' ? cur.point : 0),
    0,
  ),
});

export default getStoryPoint;
