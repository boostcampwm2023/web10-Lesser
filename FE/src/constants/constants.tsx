export const BASEURL = 'https://lesser-project.site/api';

export const REFRESH_TOKEN = 'refreshToken';

export const PROCESS_NUMBER = {
  PROCESS1: 0,
  PROCESS2: 1,
};

export const API_URL = {
  BACKLOG: '/backlogs',
  PROJECT: '/projects',
  MEMBER_SEARCH: '/members/search',
};

export const CLIENT_URL = {
  PROJECT: '/project',
  BACKLOG: (id: number | string) => `/backlog/${id}`,
};

export const reviewTabs = ['스프린트 정보', '차트', '회고란'];

export const BACKLOG_URL = {
  BACKLOG: '/backlogs',
};
