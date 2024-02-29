/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { ModalProvider } from "../common/modal/ModalProvider";
import { useModal } from "../common/modal/useModal";

const TestComponent = () => {
  const { open, close } = useModal();

  return (
    <button
      onClick={() =>
        open(
          <div id="modal">
            모달 열림
            <button onClick={close}>닫기</button>
          </div>
        )
      }
    >
      모달 열기
    </button>
  );
};

describe("modal hook test", () => {
  it("모달이 열리는가", () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText("모달 열기"));
    const modal = document.getElementById("modal");

    expect(modal).not.toBeNull();
  });

  it("모달이 닫히는가", () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    fireEvent.click(screen.getByText("모달 열기"));
    fireEvent.click(screen.getByText("닫기"));
    const modal = document.getElementById("modal");

    expect(modal).toBeNull();
  });

  it("모달 컨테이너 내부에서만 동작하는가", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "모달을 사용하기 위해선 ModalProvider 내에 컴포넌트가 존재해야 합니다."
    );
  });
});
