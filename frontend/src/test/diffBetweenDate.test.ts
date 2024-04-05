import diffBetweenDate from "../utils/diffBetweenDate";
describe("날짜 차이 계산하기", () => {
  it("일반적인 날짜 계산", () => {
    const diff = diffBetweenDate(
      "2024-03-05T12:00:00Z",
      "2024-03-06T12:00:00Z"
    );
    expect(diff).toBe(1);
  });
  it("동일한 날짜, 다른 시간 계산", () => {
    const diff = diffBetweenDate(
      "2024-03-06T12:00:00Z",
      "2024-03-06T14:01:24Z"
    );
    expect(diff).toBe(0);
  });
  it("다른 월 계산", () => {
    const diff = diffBetweenDate(
      "2024-03-06T12:00:00Z",
      "2024-04-06T14:01:24Z"
    );
    expect(diff).toBe(31);
  });
});
