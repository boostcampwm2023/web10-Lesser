import { getLoginURL } from "../apis/api/loginAPI";

describe("getGithubLoginURL", () => {
  it("getGithubLoginURL", async () => {
    const data = await getLoginURL();

    expect(data).toMatch(/^https:\/\/github\.com\/login\/oauth\/authorize\?client_id=/);
  });
});
