import { getLoginURL } from "../apis/api/loginAPI";

describe("getGithubLoginURL", () => {
  it("getGithubLoginURL", async () => {
    const data = await getLoginURL();

    expect(data).toStrictEqual({
      authUrl: "https://github.com/login/oauth/authorize?client_id=c62133d8f7084eaae8ec&scope=",
    });
  });
});
