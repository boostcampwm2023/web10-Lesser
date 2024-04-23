export const BASE_URL = "https://dev.lesser-project.site/api";

export const API_URL = {
  GITHUB_OAUTH_URL: "/auth/github/authorization-server",
  AUTH: "/auth/github/authentication",
  SIGN_UP: "/auth/github/signup",
  LOG_OUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  NICKNAME_AVAILABLILITY: "/member/availability",
  GITHUB_USERNAME: "/auth/github/username",
  PROJECT: "/project",
};

export const ROUTER_URL = {
  ROOT: "/",
  TEMP: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  AUTH: "/auth/github/callback",
  PROJECTS: "/projects",
  PROJECTS_CREATE: "projects/create",
  MAIN: "/projects/:projectId",
  BACKLOG: "/projects/:projectId/backlog",
  SPRINT: "/projects/:projectId/sprint",
  SPRINT_CREATE: "/projects/:projectId/sprint/create",
  SETTINGS: "/projects/:projectId/settings",
  INVITE: "projects/invite/:projectTitle/:projectId",
  ERROR: "/error",
};

export const LINK_URL = {
  MAIN: (projectId: string) => `/projects/${projectId}`,
  BACKLOG: (projectId: string) => `/projects/${projectId}/backlog`,
  SPRINT: (projectId: string) => `/projects/${projectId}/sprint`,
  SPRINT_CREATE: (projectId: string) => `/projects/${projectId}/sprint/create`,
  SETTINGS: (projectId: string) => `/projects/${projectId}/settings`,
};
