const LOGIN = {
  GITHUB_URL: {
    URL: "http://dev.lesser-project.site/api/auth/github/authorization-server",
    RESPONSE: {
      authUrl: "https://github.com/login/oauth/authorize?client_id=c62133d8f7084eaae8ec&scope=",
    },
  },
  GITHUB_CODE: {
    URL: "http://dev.lesser-project.site/api/auth/github/authentication",
    STATUS: 209,
    RESPONSE: {
      tempIdToken: "JWT",
    },
  },
};

export default LOGIN;
