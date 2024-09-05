import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import CategoryChip from "./CategoryChip";
import useEpicEmitEvent from "../../hooks/pages/backlog/useEpicEmitEvent";
import { CATEGORY_COLOR } from "../../constants/backlog";
import {
  BacklogSocketData,
  BacklogSocketDomain,
  BacklogSocketEpicAction,
} from "../../types/common/backlog";
import EpicDropdownOption from "./EpicDropdownOption";
import { LexoRank } from "lexorank";
import getNewColor from "../../utils/getNewColor";

interface EpicDropdownProps {
  selectedEpic?: EpicCategoryDTO;
  epicList: EpicCategoryDTO[];
  onEpicChange: (epicId: number | undefined) => void;
  lastRankValue?: string;
}

const EpicDropdown = ({
  selectedEpic,
  epicList,
  onEpicChange,
  lastRankValue,
}: EpicDropdownProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const { emitEpicCreateEvent } = useEpicEmitEvent(socket);
  const [value, setValue] = useState("");
  const [epicColor, setEpicColor] = useState(
    getNewColor(Object.keys(CATEGORY_COLOR))
  );
  const inputElementRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;

    setValue(value);
  };

  const handleCreateButtonClick = () => {
    if (value.length > 10) {
      alert("에픽 이름은 10자 이하여야 합니다.");
      return;
    }

    const rankValue =
      lastRankValue !== undefined
        ? LexoRank.parse(lastRankValue).genNext().toString()
        : LexoRank.middle().toString();

    emitEpicCreateEvent({ name: value, color: epicColor, rankValue });
    setValue("");
    setEpicColor(getNewColor(Object.keys(CATEGORY_COLOR)));
  };

  const handleEnterKeydown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && value) {
      handleCreateButtonClick();
    }
  };

  const handleEpicChange = (epicId: number | undefined) => {
    onEpicChange(epicId);
  };

  const handleEpicEvent = ({ domain, action, content }: BacklogSocketData) => {
    if (
      domain === BacklogSocketDomain.EPIC &&
      action === BacklogSocketEpicAction.CREATE &&
      !selectedEpic
    ) {
      onEpicChange(content.id);
    }
  };

  useEffect(() => {
    socket.on("backlog", handleEpicEvent);
    inputElementRef.current?.focus();

    return () => {
      socket.off("backlog", handleEpicEvent);
    };
  }, []);

  return (
    <div className="absolute z-10 p-1 bg-white rounded-md w-72 shadow-box">
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
          ref={inputElementRef}
        />
      </div>
      {value ? (
        <button
          className="flex items-center gap-2 p-1"
          onClick={handleCreateButtonClick}
        >
          <span>생성</span>
          <CategoryChip content={value} bgColor={epicColor} />
        </button>
      ) : (
        <ul className="max-h-[16rem] overflow-y-auto scrollbar-thin pt-1">
          {...epicList.map((epic) => (
            <li
              key={epic.id}
              onClick={() => {
                handleEpicChange(epic.id);
              }}
            >
              <EpicDropdownOption
                key={epic.id}
                epic={epic}
                onEpicChange={handleEpicChange}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EpicDropdown;
