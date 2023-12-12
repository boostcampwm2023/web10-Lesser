import GithubIcon from '../assets/icons/GithubIcon';
import NotionIcon from '../assets/icons/NotionIcon';

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
  PROJECT: '/projects',
  PROJECT_CREATE: '/projects/create',
  BACKLOG: (id: number | string) => `/projects/${id}/backlog`,
  SPRINT: (id: number | string) => `/projects/${id}/sprint`,
};

export const reviewTabs = ['스프린트 정보', '차트', '회고란'];

export const BACKLOG_URL = {
  BACKLOG: '/backlogs',
};

export const SPRINT_BACKLOG_DROP_ID = 'sprintBacklog';

export const contributors = [
  { name: '권수린', link: 'https://github.com/surinkwon' },
  { name: '김서정', link: 'https://github.com/kimsj-git' },
  { name: '김용현', link: 'https://github.com/dongind' },
  { name: '백승민', link: 'https://github.com/whiteseungmin' },
  { name: '조영우', link: 'https://github.com/choyoungwoo9' },
];

export const socialLinks = [
  { icon: <GithubIcon />, link: 'https://github.com/boostcampwm2023/web10-Lesser' },
  { icon: <NotionIcon />, link: 'https://plastic-toad-cb0.notion.site/Lesser-b7bc965c2b154a0aafb1bf1e94c48cdc' },
];
