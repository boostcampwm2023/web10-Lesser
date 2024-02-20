/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import useDropdown from "./useDropdown.tsx";

describe("dropdown hook test", () => {
  const placeholder = "드롭다운 버튼";
  const options = ["옵션1", "옵션2", "옵션3"];

  const TestComponent = () => {
    const placeholder = "드롭다운 버튼";
    const options = ["옵션1", "옵션2", "옵션3"];
    const { Dropdown, setSelectedOption } = useDropdown({
      placeholder,
      options,
    });

    const handleOptionClick = (option: string) => {
      setSelectedOption(option);
    };

    return <>{Dropdown({ onOptionClick: handleOptionClick })}</>;
  };

  it("드롭다운 클릭 시 잘 펼쳐지는가", () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText(placeholder));

    expect(screen.getByText(options[0]).textContent).toBe(options[0]);
  });

  it("옵션 선택 시 드롭다운이 닫히고 선택이 되는가", () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText(placeholder));
    fireEvent.click(screen.getByText(options[0]));

    expect(screen.getByText(options[0]).textContent).toBe(options[0]);
    expect(screen.queryByText(options[1])).toBeNull();
  });

  it("버튼 재 클릭 시 드롭다운이 닫히는가", () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText(placeholder));
    fireEvent.click(screen.getByText(placeholder));

    expect(screen.getByText(placeholder).textContent).toBe(placeholder);
    expect(screen.queryByText(options[0])).toBeNull();
  });
});
