import isValidURL from "../utils/isValidURL";

describe("URL 유효성 검사 함수", () => {
  it("스킴이 http, https가 아닐 때", () => {
    expect(isValidURL("ftp://example.com/file.txt")).toBe(false);
  });

  it("도메인 이름이 형식에 맞지 않을 때", () => {
    expect(isValidURL("http://example!.com")).toBe(false);
    expect(isValidURL("http://exa mple.com")).toBe(false);
    expect(isValidURL("http://exam*ple.com")).toBe(false);
    expect(isValidURL("http://.com")).toBe(false);
  });

  it("쿼리 스트링 포함", () => {
    expect(isValidURL("https://www.google.com/search?q=openai")).toBe(true);
  });
});
