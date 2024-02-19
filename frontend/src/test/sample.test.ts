import { sampleFunction } from "../utils/sampleFunction";

describe("sample Test", () => {
  it("number test", () => {
    expect(3 + 4).toBe(7);
  });

  it("import test", () => {
    expect(sampleFunction(3, 4)).toBe(7);
  });
});
