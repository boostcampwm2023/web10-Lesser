import { MouseEvent } from "react";
import { Socket } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import EpicDropdown from "./EpicDropdown";
import BacklogStatusChip from "./BacklogStatusChip";
import CategoryChip from "./CategoryChip";
import BacklogStatusDropdown from "./BacklogStatusDropdown";
import ConfirmModal from "../common/ConfirmModal";
import useBacklogInputChange from "../../hooks/pages/backlog/useBacklogInputChange";
import useStoryEmitEvent from "../../hooks/pages/backlog/useStoryEmitEvent";
import useDropdownState from "../../hooks/common/dropdown/useDropdownState";
import { useModal } from "../../hooks/common/modal/useModal";
import ChevronRight from "../../assets/icons/chevron-right.svg?react";
import ChevronDown from "../../assets/icons/chevron-down.svg?react";
import TrashCan from "../../assets/icons/trash-can.svg?react";
import { MOUSE_KEY } from "../../constants/event";
import { BacklogStatusType, EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import TextInputColumn from "./common/TextInputColumn";
import NumberInputColumn from "./common/NumberInputColumn";

interface StoryBlockProps {
  id: number;
  epic: EpicCategoryDTO;
  title: string;
  point: number | null;
  progress: number;
  status: BacklogStatusType;
  taskExist: boolean;
  epicList?: EpicCategoryDTO[];
  showTaskList: boolean;
  onShowTaskList: () => void;
}

const StoryBlock = ({
  id,
  epic,
  title,
  point,
  progress,
  status,
  taskExist,
  epicList,
  showTaskList,
  onShowTaskList,
}: StoryBlockProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const {
    updating: titleUpdating,
    handleUpdating: handleTitleUpdatingOpen,
    inputContainerRef: titleRef,
    inputElementRef: titleInputRef,
    handleEnterKeyup: handleTitleEnterKeyup,
  } = useBacklogInputChange(updateTitle);
  const {
    updating: pointUpdating,
    handleUpdating: handlePointUpdatingOpen,
    inputContainerRef: pointRef,
    inputElementRef: pointInputRef,
    handleEnterKeyup: handlePointEnterKeyup,
  } = useBacklogInputChange(updatePoint);
  const {
    open: statusUpdating,
    handleOpen: handleStatusUpdateOpen,
    dropdownRef: statusRef,
  } = useDropdownState();
  const {
    open: epicUpdating,
    handleOpen: handleEpicUpdateOpen,
    handleClose: handleEpicUpdateClose,
    dropdownRef: epicRef,
  } = useDropdownState();
  const {
    open: deleteMenuOpen,
    handleOpen: handleDeleteMenuOpen,

    dropdownRef: blockRef,
  } = useDropdownState();
  const { emitStoryUpdateEvent, emitStoryDeleteEvent } =
    useStoryEmitEvent(socket);
  const { open, close } = useModal();

  function updateTitle<T>(data: T) {
    if (!data || data === title) {
      return;
    }

    if ((data as string).length > 100) {
      alert("스토리 제목은 100자 이하여야 합니다.");
      return;
    }

    emitStoryUpdateEvent({ id, title: data as string });
  }
  function updatePoint<T>(data: T) {
    const newPoint = Number(data);
    if ((!data && data !== 0) || newPoint === point) {
      return;
    }

    if (newPoint < 0 || newPoint > 100) {
      alert("스토리 포인트는 0이상 100이하여야 합니다.");
      return;
    }

    if (!Number.isInteger(newPoint)) {
      alert("포인트는 정수여야 합니다.");
      return;
    }

    emitStoryUpdateEvent({ id, point: newPoint });
  }

  function updateStatus(data: BacklogStatusType) {
    if (data === status) {
      return;
    }
    emitStoryUpdateEvent({ id, status: data as BacklogStatusType });
  }

  function updateEpic(data: number | undefined) {
    if (!data || data === epic.id) {
      handleEpicUpdateClose();
      return;
    }

    emitStoryUpdateEvent({ id, epicId: data });
    handleEpicUpdateClose();
  }

  const handleRightButtonClick = (event: MouseEvent) => {
    if (event.button === MOUSE_KEY.RIGHT) {
      handleDeleteMenuOpen();
    }
  };

  const handleEpicColumnClick = () => {
    if (!epicUpdating) {
      handleEpicUpdateOpen();
    }
  };

  const handleStoryDelete = () => {
    emitStoryDeleteEvent({ id });
    close();
  };

  const handleDeleteButtonClick = () => {
    open(
      <ConfirmModal
        title="스토리 삭제"
        body="해당 스토리와 연결된 모든 태스크가 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        confirmColor="#E33535"
        cancelColor="#C6C6C6"
        onCancelButtonClick={close}
        onConfirmButtonClick={handleStoryDelete}
      />
    );
  };

  return (
    <>
      <div
        className="flex items-center py-1 border-t border-b"
        onMouseUp={handleRightButtonClick}
        onContextMenu={(event) => event.preventDefault()}
        ref={blockRef}
      >
        {epicList && (
          <div
            className="w-[5rem] mr-5 hover:cursor-pointer"
            onClick={handleEpicColumnClick}
            ref={epicRef}
          >
            <CategoryChip content={epic.name} bgColor={epic.color} />

            {epicUpdating && (
              <EpicDropdown
                selectedEpic={epic}
                epicList={epicList}
                onEpicChange={updateEpic}
                lastRankValue={
                  epicList.length
                    ? epicList[epicList.length - 1].rankValue
                    : undefined
                }
              />
            )}
          </div>
        )}

        <div
          className="flex items-center gap-1 w-[40.9rem] mr-4 hover:cursor-pointer"
          onClick={() => handleTitleUpdatingOpen(true)}
          ref={titleRef}
        >
          <button
            className="flex items-center justify-center w-5 h-5 rounded-md hover:bg-dark-gray hover:bg-opacity-20"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onShowTaskList();
            }}
          >
            {showTaskList ? (
              <ChevronDown
                width={16}
                height={16}
                fill={taskExist ? "black" : "#C5C5C5"}
              />
            ) : (
              <ChevronRight
                width={16}
                height={16}
                fill={taskExist ? "black" : "#C5C5C5"}
              />
            )}
          </button>
          <TextInputColumn
            updating={titleUpdating}
            inputRef={titleInputRef}
            value={title}
            onKeyUp={handleTitleEnterKeyup}
          />
        </div>
        <div
          className="flex items-center gap-1 w-[4rem] mr-[2.76rem] text-right hover:cursor-pointer"
          onClick={() => handlePointUpdatingOpen(true)}
          ref={pointRef}
        >
          <NumberInputColumn
            updating={pointUpdating}
            inputRef={pointInputRef}
            value={point}
            onKeyUp={handlePointEnterKeyup}
          />
          <span> POINT</span>
        </div>
        <div className="w-[4rem] mr-[2.76rem] text-right">
          <span>{progress}%</span>
        </div>
        <div
          className="w-[6.25rem] hover:cursor-pointer relative"
          onClick={handleStatusUpdateOpen}
        >
          <div ref={statusRef}>
            <BacklogStatusChip status={status} />
          </div>
          {statusUpdating && (
            <BacklogStatusDropdown onOptionClick={updateStatus} />
          )}
        </div>
      </div>
      {deleteMenuOpen && (
        <div className="absolute px-2 py-1 bg-white rounded-md shadow-box">
          <button
            className="flex items-center w-full gap-3"
            type="button"
            onClick={handleDeleteButtonClick}
          >
            <TrashCan width={20} height={20} fill="red" />
            <span>삭제</span>
          </button>
        </div>
      )}
    </>
  );
};

export default StoryBlock;
