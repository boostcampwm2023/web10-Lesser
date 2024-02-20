import { sampleFunction } from "../utils/sampleFunction";

describe("sample Test", () => {
  it("number test", () => {
    expect(3 + 4).toBe(7);
  });

  it("import test", () => {
    expect(sampleFunction(3, 4)).toBe(7);
  });
});

// describe("MSW 테스트")
describe("MSW test", () => {
  it("msw test", async () => {
    const response = await fetch("http://localhost:5173/test");
    const data = await response.json();

    expect(data).toStrictEqual(["This", "is", "test"]);
  });
});
