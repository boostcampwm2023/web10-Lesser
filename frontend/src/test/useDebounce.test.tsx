/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import useDebounce from "../hooks/common/useDebounce";

jest.useFakeTimers();

describe("useDebounce test", () => {
  const { result } = renderHook(() => useDebounce());
  const debounce = result.current;
  const delay = 1000;

  it("일정 기간 동안 여러 번 호출되어도 한 번만 실행되는가", () => {
    let count = 0;
    debounce(delay, () => (count += 1));
    debounce(delay, () => (count += 1));

    jest.runAllTimers();
    expect(count).toBe(1);
  });

  it("지정한 딜레이 시간 이후 호출하면 실행 되는가", () => {
    let count = 0;
    debounce(delay, () => (count += 1));
    setTimeout(() => {
      debounce(delay, () => (count += 1));
    }, 2000);

    jest.runAllTimers();
    expect(count).toBe(2);
  });
});
