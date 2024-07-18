import { useEffect, useRef } from "react";
import TrashCan from "../../assets/icons/trash-can.svg?react";
import { CATEGORY_COLOR } from "../../constants/backlog";
import { useModal } from "../../hooks/common/modal/useModal";
import ConfirmModal from "../common/ConfirmModal";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import useEpicEmitEvent from "../../hooks/pages/backlog/useEpicEmitEvent";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import Check from "../../assets/icons/check.svg?react";
import { BacklogCategoryColor } from "../../types/common/backlog";

interface EpicUpdateBoxProps {
  epic: EpicCategoryDTO;
  onBoxClose: () => void;
  onEpicChange: (epicId: number | undefined) => void;
}

const EpicUpdateBox = ({
  epic,
  onBoxClose,
  onEpicChange,
}: EpicUpdateBoxProps) => {
  const { open, close } = useModal();
  const { socket }: { socket: Socket } = useOutletContext();
  const { emitEpicDeleteEvent, emitEpicUpdateEvent } = useEpicEmitEvent(socket);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const colorList = Object.entries(CATEGORY_COLOR);

  const handleConfirmButtonClick = () => {
    // event?.stopPropagation();
    onEpicChange(undefined);
    emitEpicDeleteEvent({ id: epic.id });
    onBoxClose();
    close();
  };

  const handleDeleteButtonClick = () => {
    // event.stopPropagation();
    open(
      <ConfirmModal
        title="에픽을 삭제하시겠습니까?"
        body="해당 에픽에 포함된 스토리도 모두 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        confirmColor="#E33535"
        cancelColor="#C6C6C6"
        onCancelButtonClick={close}
        onConfirmButtonClick={handleConfirmButtonClick}
      />
    );
  };

  const handleEnterKeydown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && inputRef.current?.value) {
      emitEpicUpdateEvent({ id: epic.id, name: inputRef.current?.value });
    }
  };

  const handleColorUpdate = (
    event: React.MouseEvent,
    color: BacklogCategoryColor
  ) => {
    event.stopPropagation();
    if (epic.color === color) {
      return;
    }

    emitEpicUpdateEvent({ id: epic.id, color });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="absolute top-0 z-10 p-2 bg-white rounded-md left-3/4 w-fit shadow-box"
      onClick={(event) => event.stopPropagation()}
    >
      <p className="text-xxs text-text-gray">에픽 수정</p>
      <input
        className="p-1 mb-2 border-b rounded-sm border-b-text-gray focus:outline-none"
        type="text"
        ref={inputRef}
        onKeyDown={handleEnterKeydown}
      />
      <ul>
        {...colorList.map(([name, color]) => (
          <li
            key={color}
            className="flex items-center gap-2 pl-1 pr-2 mb-1 rounded-md hover:cursor-pointer hover:bg-gray-100"
            onClick={(event) =>
              handleColorUpdate(event, name as BacklogCategoryColor)
            }
          >
            <div className={`w-5 h-5 rounded-md ${color}`}></div>
            <span>{name}</span>
            {epic.color === name && (
              <Check
                width={16}
                height={16}
                className="ml-auto"
                stroke="black"
              />
            )}
          </li>
        ))}
      </ul>
      <button
        className="flex items-center w-full gap-2 mt-2 rounded-md hover:bg-red-50 text-error-red"
        type="button"
        onClick={handleDeleteButtonClick}
      >
        <TrashCan width={20} height={20} fill="red" />
        <span>삭제</span>
      </button>
    </div>
  );
};

export default EpicUpdateBox;
