import { ChangeEvent, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import CategoryChip from "./CategoryChip";
import useEpicEmitEvent from "../../hooks/pages/backlog/useEpicEmitEvent";
import { CATEGORY_COLOR } from "../../constants/backlog";
import getRandomNumber from "../../utils/getRandomNumber";
import { BacklogCategoryColor } from "../../types/common/backlog";

interface EpicDropdownProps {
  selectedEpic?: EpicCategoryDTO;
  epicList: EpicCategoryDTO[];
}

const EpicDropdown = ({ selectedEpic, epicList }: EpicDropdownProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const { emitEpicCreateEvent } = useEpicEmitEvent(socket);
  const [value, setValue] = useState("");

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;

    setValue(value);
  };

  const handleEnterKeydown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && value) {
      setValue("");
      const colors = Object.keys(CATEGORY_COLOR);
      const color = colors[
        getRandomNumber(0, colors.length - 1)
      ] as BacklogCategoryColor;
      emitEpicCreateEvent({ name: value, color });
    }
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
          onKeyDown={handleEnterKeydown}
        />
      </div>
      <ul className="pt-1">
        {...epicList.map((epic) => (
          <li
            className="flex justify-between px-1 py-1 rounded-md hover:cursor-pointer hover:bg-gray-100"
            key={epic.id}
          >
            <CategoryChip content={epic.name} bgColor={epic.color} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpicDropdown;
