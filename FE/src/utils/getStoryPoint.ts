import { ReadBacklogTaskResponseDto } from '../types/backlog';

const getStoryPoint = (taskList: ReadBacklogTaskResponseDto[]) =>
  taskList.reduce((acc: number, cur: ReadBacklogTaskResponseDto) => acc + cur.point, 0);

export default getStoryPoint;
