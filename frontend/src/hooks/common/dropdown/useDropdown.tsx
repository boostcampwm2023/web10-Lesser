import { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "../../../assets/icons/chevron-down.svg?react";
import ChevronUpIcon from "../../../assets/icons/chevron-up.svg?react";

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

const useDropdown = ({ placeholder, options, defaultOption }: useDropdownParams) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultOption ? defaultOption : "");
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const Dropdown = ({
    buttonClassName = "",
    containerClassName = "",
    itemClassName = "",
    iconSize = "24",
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
      if (dropdownRef.current && !dropdownRef.current.contains(target as Node)) {
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
          style={{ wordBreak: "keep-all" }}
        >
          {selectedOption || placeholder}
          {open ? (
            <ChevronUpIcon width={iconSize} height={iconSize} stroke="#FFFFFF" />
          ) : (
            <ChevronDownIcon width={iconSize} height={iconSize} stroke="#FFFFFF" />
          )}
        </button>
        {open && (
          <ul className={`${containerClassName} absolute`}>
            {options.map((option, index) => (
              <li
                key={index}
                onMouseDown={() => handleOptionClick(option)}
                className={`${
                  selectedOption === option ? "text-middle-green" : "text-text-gray"
                } ${itemClassName} hover:cursor-pointer`}
                style={{ wordBreak: "keep-all" }}
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
