import { Socket } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import useShowDetail from "../../hooks/pages/backlog/useShowDetail";
import { BacklogStatusType, EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import BacklogStatusChip from "./BacklogStatusChip";
import CategoryChip from "./CategoryChip";
import ChevronDown from "../../assets/icons/chevron-down.svg?react";
import ChevronRight from "../../assets/icons/chevron-right.svg?react";
import TaskContainer from "./TaskContainer";
import TaskHeader from "./TaskHeader";
import BacklogStatusDropdown from "./BacklogStatusDropdown";
import useStoryEmitEvent from "../../hooks/pages/backlog/useStoryEmitEvent";
import useBacklogInputChange from "../../hooks/pages/backlog/useBacklogInputChange";
import { MouseEvent } from "react";
import { MOUSE_KEY } from "../../constants/event";
import useDropdownState from "../../hooks/common/dropdown/useDropdownState";
import TrashCan from "../../assets/icons/trash-can.svg?react";
import { useModal } from "../../hooks/common/modal/useModal";
import ConfirmModal from "../common/ConfirmModal";
import EpicDropdown from "./EpicDropdown";
import TaskCreateBlock from "./TaskCreateBlock";

interface StoryBlockProps {
  id: number;
  epic: EpicCategoryDTO;
  title: string;
  point: number | null;
  progress: number;
  status: BacklogStatusType;
  children: React.ReactNode;
  taskExist: boolean;
  epicList?: EpicCategoryDTO[];
  finished?: boolean;
  lastTaskRankValue?: string;
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
  finished = false,
  lastTaskRankValue,
  children,
}: StoryBlockProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const { showDetail, handleShowDetail } = useShowDetail();
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
              handleShowDetail(!showDetail);
            }}
          >
            {showDetail ? (
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
          {titleUpdating ? (
            <input
              className={`w-full rounded-sm focus:outline-none bg-gray-200 hover:cursor-pointer`}
              type="text"
              ref={titleInputRef}
              defaultValue={title}
              onKeyUp={handleTitleEnterKeyup}
            />
          ) : (
            <span
              title={title}
              className="w-full overflow-hidden hover:cursor-pointer text-ellipsis whitespace-nowrap"
            >
              {title}
            </span>
          )}
        </div>
        <div
          className="flex items-center gap-1 w-[4rem] mr-[2.76rem] text-right hover:cursor-pointer"
          onClick={() => handlePointUpdatingOpen(true)}
          ref={pointRef}
        >
          {pointUpdating ? (
            <input
              className={`min-w-[1.75rem] no-arrows text-right focus:outline-none rounded-sm bg-gray-200 hover:cursor-pointer`}
              type="number"
              ref={pointInputRef}
              defaultValue={point !== 0 && !point ? 0 : point}
              onKeyUp={handlePointEnterKeyup}
            />
          ) : (
            <span className="min-w-[1.75rem] text-right">{point}</span>
          )}

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
      {showDetail && (
        <TaskContainer>
          <TaskHeader />
          {children}
          {!finished && (
            <TaskCreateBlock storyId={id} {...{ lastTaskRankValue }} />
          )}
        </TaskContainer>
      )}
    </>
  );
};

export default StoryBlock;
