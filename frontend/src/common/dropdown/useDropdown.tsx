import { useEffect, useRef, useState } from "react";

interface useDropdownParams {
  placeholder: string;
  options: string[];
}

interface DropdownProps {
  onOptionClick: (option: string) => void;
}

const useDropdown = ({ placeholder, options }: useDropdownParams) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const Dropdown = ({ onOptionClick }: DropdownProps) => {
    return (
      <div className="relative">
        <button ref={dropdownRef} onClick={handleButtonClick}>
          {selectedOption || placeholder}
        </button>
        {open && (
          <ul className="absolute">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => onOptionClick(option)}
                className="hover:cursor-pointer"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const handleButtonClick = () => {
    setOpen((prevState) => !prevState);
  };

  const handleOutsideClick = ({ target }: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      window.addEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [open]);

  return { Dropdown, selectedOption, setSelectedOption };
};

export default useDropdown;
