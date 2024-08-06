import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import CategoryChip from "./CategoryChip";
import useEpicEmitEvent from "../../hooks/pages/backlog/useEpicEmitEvent";
import { CATEGORY_COLOR } from "../../constants/backlog";
import getRandomNumber from "../../utils/getRandomNumber";
import {
  BacklogCategoryColor,
  BacklogSocketData,
  BacklogSocketDomain,
  BacklogSocketEpicAction,
} from "../../types/common/backlog";
import EpicDropdownOption from "./EpicDropdownOption";
import { LexoRank } from "lexorank";

interface EpicDropdownProps {
  selectedEpic?: EpicCategoryDTO;
  epicList: EpicCategoryDTO[];
  onEpicChange: (epicId: number | undefined) => void;
}

const EpicDropdown = ({
  selectedEpic,
  epicList,
  onEpicChange,
}: EpicDropdownProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const { emitEpicCreateEvent } = useEpicEmitEvent(socket);
  const [value, setValue] = useState("");
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const epicColor = useMemo(() => {
    const colors = Object.keys(CATEGORY_COLOR);
    return colors[
      getRandomNumber(0, colors.length - 1)
    ] as BacklogCategoryColor;
  }, []);

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;

    setValue(value);
  };

  const handleEnterKeydown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && value) {
      if (value.length > 10) {
        alert("에픽 이름은 10자 이하여야 합니다.");
        return;
      }

      const rankValue = epicList.length
        ? LexoRank.parse(epicList[epicList.length - 1].rankValue)
            .genNext()
            .toString()
        : LexoRank.middle().toString();

      setValue("");
      emitEpicCreateEvent({ name: value, color: epicColor, rankValue });
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
    <div className="max-h-[18.7rem] overflow-y-auto absolute z-10 p-1 bg-white rounded-md w-72 shadow-box">
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
        <div className="flex items-center gap-2 p-1">
          <span>생성</span>
          <CategoryChip content={value} bgColor={epicColor} />
        </div>
      ) : (
        <ul className="pt-1">
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
