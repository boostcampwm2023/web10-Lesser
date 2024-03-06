import { useEffect, useRef, useState } from "react";

interface useDropdownParams {
  placeholder: string;
  options: string[];
}

interface DropdownProps {
  buttonClassName?: string;
  containerClassName?: string;
  itemClassName?: string;
}

const useDropdown = ({ placeholder, options }: useDropdownParams) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const Dropdown = ({
    buttonClassName = "",
    containerClassName = "",
    itemClassName = "",
  }: DropdownProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleButtonClick = () => {
      setOpen((prevState) => !prevState);
    };

    const handleOptionClick = (option: string) => {
      setSelectedOption(option);
      setOpen(false);
    };

    const handleOutsideClick = ({ target }: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target as Node)
      ) {
        setOpen(false);
      }
    };

    useEffect(() => {
      window.addEventListener("click", handleOutsideClick);

      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }, []);

    return (
      <div className="relative">
        <button
          ref={dropdownRef}
          onClick={handleButtonClick}
          className={buttonClassName}
        >
          {selectedOption || placeholder}
        </button>
        {open && (
          <ul className={`${containerClassName} absolute`}>
            {options.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => handleOptionClick(option)}
                className={`${itemClassName} hover:cursor-pointer`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return { Dropdown, selectedOption };
};

export default useDropdown;
