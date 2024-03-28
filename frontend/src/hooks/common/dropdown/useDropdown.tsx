import { useEffect, useRef, useState } from "react";
import chevronDown from "../../../assets/icons/chevron-down.svg";
import chevronUp from "../../../assets/icons/chevron-up.svg";

interface useDropdownParams {
  placeholder: string;
  options: string[];
  defaultOption?: string;
}

interface DropdownProps {
  buttonClassName?: string;
  containerClassName?: string;
  itemClassName?: string;
  iconSize?: string;
}

const useDropdown = ({
  placeholder,
  options,
  defaultOption,
}: useDropdownParams) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    defaultOption ? defaultOption : ""
  );
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const Dropdown = ({
    buttonClassName = "",
    containerClassName = "",
    itemClassName = "",
    iconSize = "",
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
          className={`${buttonClassName} ${open && "shadow-none"}`}
        >
          {selectedOption || placeholder}
          {open ? (
            <img
              src={chevronUp}
              className={`"w-${iconSize}"`}
              alt="드롭다운 화살표"
            />
          ) : (
            <img
              src={chevronDown}
              className={`"w-${iconSize}"`}
              alt="드롭다운 화살표"
            />
          )}
        </button>
        {open && (
          <ul className={`${containerClassName} absolute`}>
            {options.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => handleOptionClick(option)}
                className={`${
                  selectedOption === option
                    ? "text-middle-green"
                    : "text-text-gray"
                } ${itemClassName} hover:cursor-pointer`}
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
