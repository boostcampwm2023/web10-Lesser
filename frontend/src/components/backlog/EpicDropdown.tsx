import { ChangeEvent, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import CategoryChip from "./CategoryChip";
import useEpicEmitEvent from "../../hooks/pages/backlog/useEpicEmitEvent";
import { CATEGORY_COLOR } from "../../constants/backlog";
import getRandomNumber from "../../utils/getRandomNumber";
import { BacklogCategoryColor } from "../../types/common/backlog";
import EpicDropdownOption from "./EpicDropdownOption";

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
    <div className="relative p-1 rounded-md w-72 shadow-box">
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
          <EpicDropdownOption key={epic.id} epic={epic} />
        ))}
      </ul>
    </div>
  );
};

export default EpicDropdown;
