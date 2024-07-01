import { ChangeEvent, useState } from "react";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import CategoryChip from "./CategoryChip";
import TrashCan from "../../assets/icons/trash-can.svg?react";

interface EpicDropdownProps {
  selectedEpic?: EpicCategoryDTO;
  epicList: EpicCategoryDTO[];
}

const EpicDropdown = ({ selectedEpic, epicList }: EpicDropdownProps) => {
  const [value, setValue] = useState("");

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;

    setValue(value);
  };

  return (
    <div className="p-1 rounded-md w-72 shadow-box">
      <div className="flex p-1 border-b-2">
        {selectedEpic && (
          <div className="min-w-[5rem]">
            <CategoryChip
              content={selectedEpic.name}
              bgColor={selectedEpic.color}
            />
          </div>
        )}
        <input
          className="w-full outline-none"
          type="text"
          placeholder={!selectedEpic ? "에픽" : ""}
          value={value}
          onChange={handleInputChange}
        />
      </div>
      <ul className="pt-1">
        {...epicList.map((epic) => (
          <li
            className="flex justify-between px-1 py-1 rounded-md group hover:cursor-pointer hover:bg-gray-100"
            key={epic.id}
          >
            <CategoryChip content={epic.name} bgColor={epic.color} />
            <button
              className="invisible px-1 group-hover:visible"
              type="button"
            >
              <TrashCan width={20} height={20} fill="red" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpicDropdown;
