import { ReadBacklogTaskResponseDto } from '../types/backlog';
import getStoryPoint from '../utils/getStoryPoint';

const sampleTaskList1: Array<ReadBacklogTaskResponseDto> = [
  {
    id: 2,
    title: '[BE]에픽 목록을 화면이 렌더링',
    sequence: 1,
    point: 3,
    userId: null,
    condition: '인수조건 인수분해 인수합병 인수인계',
    state: 'Todo',
  },
  {
    id: 3,
    sequence: 2,
    title: '[BE]에픽 목록을 화면이 렌더링',
    point: 3,
    userId: 1,
    condition: '인수조건 인수분해 인수합병 인수인계',
    state: 'Todo',
  },
];

const sampleTaskList2: Array<ReadBacklogTaskResponseDto> = [
  {
    id: 2,
    title: '[BE]에픽 목록을 화면이 렌더링',
    sequence: 1,
    point: 3,
    userId: null,
    condition: '인수조건 인수분해 인수합병 인수인계',
    state: 'Todo',
  },
  {
    id: 3,
    sequence: 2,
    title: '[BE]에픽 목록을 화면이 렌더링',
    point: 3,
    userId: 1,
    condition: '인수조건 인수분해 인수합병 인수인계',
    state: 'Done',
  },
];
const sampleTaskList3: Array<ReadBacklogTaskResponseDto> = [
  {
    id: 2,
    title: '[BE]에픽 목록을 화면이 렌더링',
    sequence: 1,
    point: 3,
    userId: null,
    condition: '인수조건 인수분해 인수합병 인수인계',
    state: 'Todo',
  },
  {
    id: 3,
    sequence: 2,
    title: '[BE]에픽 목록을 화면이 렌더링',
    point: 3,
    userId: 1,
    condition: '인수조건 인수분해 인수합병 인수인계',
    state: 'InProgress',
  },
];

test('스토리 포인트 계산1', () => {
  expect(getStoryPoint(sampleTaskList1)).toEqual({ TOTAL: 6, REMAIN: 6 });
});
test('스토리 포인트 계산2', () => {
  expect(getStoryPoint(sampleTaskList2)).toEqual({ TOTAL: 6, REMAIN: 3 });
});
test('스토리 포인트 계산3', () => {
  expect(getStoryPoint(sampleTaskList3)).toEqual({ TOTAL: 6, REMAIN: 6 });
});
