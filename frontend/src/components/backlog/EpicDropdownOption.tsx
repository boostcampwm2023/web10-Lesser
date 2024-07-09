import CategoryChip from "./CategoryChip";
import MenuKebab from "../../assets/icons/menu-kebab.svg?react";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";

import { MouseEvent } from "react";

interface EpicDropdownOptionProps {
  epic: EpicCategoryDTO;
  onOpen: () => void;
}

const EpicDropdownOption = ({ epic, onOpen }: EpicDropdownOptionProps) => {
  const handleMenuButtonClick = (event: MouseEvent) => {
    event.stopPropagation();
    onOpen();
  };

  return (
    <div className="flex justify-between px-1 py-1 rounded-md group hover:cursor-pointer hover:bg-gray-100">
      <CategoryChip content={epic.name} bgColor={epic.color} />
      <button
        className="invisible px-1 rounded-md group-hover:visible hover:bg-gray-300"
        type="button"
        onClick={handleMenuButtonClick}
      >
        <MenuKebab width={20} height={20} stroke="#696969" />
      </button>
    </div>
  );
};

export default EpicDropdownOption;
