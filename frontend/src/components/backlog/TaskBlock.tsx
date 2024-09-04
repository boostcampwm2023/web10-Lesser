import { MouseEvent, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import useDropdownState from "../../hooks/common/dropdown/useDropdownState";
import useBacklogInputChange from "../../hooks/pages/backlog/useBacklogInputChange";
import useTaskEmitEvent from "../../hooks/pages/backlog/useTaskEmitEvent";
import AssignedMemberDropdown from "./AssignedMemberDropdown";
import BacklogStatusChip from "./BacklogStatusChip";
import BacklogStatusDropdown from "./BacklogStatusDropdown";
import useMemberStore from "../../stores/useMemberStore";
import { BacklogStatusType, TaskDTO } from "../../types/DTO/backlogDTO";
import { useModal } from "../../hooks/common/modal/useModal";
import { MOUSE_KEY } from "../../constants/event";
import ConfirmModal from "../common/ConfirmModal";
import TrashCan from "../../assets/icons/trash-can.svg?react";
import isIntegerOrOneDecimalPlace from "../../utils/isIntegerOrOneDecimalPlace";
import TextInputColumn from "./common/TextInputColumn";
import NumberInputColumn from "./common/NumberInputColumn";

const TaskBlock = ({
  id,
  displayId,
  title,
  assignedMemberId,
  expectedTime,
  actualTime,
  status,
}: TaskDTO) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const {
    inputContainerRef: titleRef,
    inputElementRef: titleInputRef,
    updating: titleUpdating,
    handleUpdating: handleTitleUpdating,
    handleEnterKeyup: handleTitleKeyup,
  } = useBacklogInputChange(updateTitle);
  const {
    inputContainerRef: expectedTimeRef,
    inputElementRef: expectedTimeInputRef,
    updating: expectedTimeUpdating,
    handleUpdating: handleExpectedTimeUpdating,
    handleEnterKeyup: handleExpectedTimeKeyup,
  } = useBacklogInputChange(updateExpectedTime);
  const {
    inputContainerRef: actualTimeRef,
    inputElementRef: actualTimeInputRef,
    updating: actualTimeUpdating,
    handleUpdating: handleActualTimeUpdating,
    handleEnterKeyup: handleActualTimeKeyup,
  } = useBacklogInputChange(updateActualTime);
  const {
    open: assignedMemberUpdating,
    handleOpen: handleAssignedMemberUpdateOpen,
    dropdownRef: assignedMemberRef,
  } = useDropdownState();
  const {
    open: statusUpdating,
    handleOpen: handleStatusUpdateOpen,
    dropdownRef: statusRef,
  } = useDropdownState();
  const myInfo = useMemberStore((state) => state.myInfo);
  const partialMemberList = useMemberStore((state) => state.memberList);
  const { emitTaskUpdateEvent, emitTaskDeleteEvent } = useTaskEmitEvent(socket);
  const {
    open: deleteMenuOpen,
    handleOpen: handleDeleteMenuOpen,

    dropdownRef: blockRef,
  } = useDropdownState();
  const { open, close } = useModal();

  const assignedMemberName = useMemo(() => {
    if (assignedMemberId === null || myInfo.id === -1) {
      return "";
    }

    if (myInfo.id === assignedMemberId) {
      return myInfo.username;
    }

    return partialMemberList.filter(({ id }) => id === assignedMemberId)[0]
      .username;
  }, [assignedMemberId, partialMemberList]);

  function updateTitle<T>(data: T) {
    if (data === title) {
      return;
    }

    if (!data) {
      alert("태스크 타이틀을 입력해주세요");
      return;
    }

    if ((data as string).length > 100) {
      alert("태스크 타이틀은 100자 이하여야 합니다.");
      return;
    }

    emitTaskUpdateEvent({ id, title: data as string });
  }
  function updateExpectedTime<T>(data: T) {
    if (
      data === String(expectedTime) ||
      (data === "" && expectedTime === null)
    ) {
      return;
    }

    if (data === "") {
      emitTaskUpdateEvent({ id, expectedTime: null });
      return;
    }

    if (
      !isNaN(Number(data)) &&
      (Number(data) >= 100 ||
        Number(data) < 0 ||
        !isIntegerOrOneDecimalPlace(Number(data)))
    ) {
      alert(
        "예상 시간은 0이상, 100미만의 정수 또는 소수점 한 자릿수여야 합니다."
      );
      return;
    }

    emitTaskUpdateEvent({ id, expectedTime: Number(data) });
  }
  function updateActualTime<T>(data: T) {
    if (data === String(actualTime) || (data === "" && actualTime === null)) {
      return;
    }

    if (data === "") {
      emitTaskUpdateEvent({ id, actualTime: null });
      return;
    }

    if (
      !isNaN(Number(data)) &&
      (Number(data) >= 100 ||
        Number(data) < 0 ||
        !isIntegerOrOneDecimalPlace(Number(data)))
    ) {
      alert(
        "실제 시간은 0이상, 100미만의 정수 또는 소수점 한 자릿수여야 합니다."
      );
      return;
    }
    emitTaskUpdateEvent({ id, actualTime: Number(data) });
  }
  function updateAssignedMember(data: number) {
    if (data === assignedMemberId) {
      return;
    }

    emitTaskUpdateEvent({ id, assignedMemberId: data });
  }

  function updateStatus(data: BacklogStatusType) {
    if (data === status) {
      return;
    }

    emitTaskUpdateEvent({ id, status: data });
  }

  const handleRightButtonClick = (event: MouseEvent) => {
    if (event.button === MOUSE_KEY.RIGHT) {
      handleDeleteMenuOpen();
    }
  };

  const handleTaskDelete = () => {
    emitTaskDeleteEvent({ id });
    close();
  };

  const handleDeleteButtonClick = () => {
    open(
      <ConfirmModal
        title="태스크 삭제"
        body="태스크가 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        confirmColor="#E33535"
        cancelColor="#C6C6C6"
        onCancelButtonClick={close}
        onConfirmButtonClick={handleTaskDelete}
      />
    );
  };

  return (
    <>
      <div
        className="flex items-center justify-between py-1 border-b"
        onMouseUp={handleRightButtonClick}
        onContextMenu={(event) => event.preventDefault()}
        ref={blockRef}
      >
        <p className="w-[4rem] truncate">Task-{displayId}</p>
        <div
          className="w-[25rem] min-h-[1.5rem] hover:cursor-pointer truncate"
          ref={titleRef}
          onClick={() => handleTitleUpdating(true)}
        >
          <TextInputColumn
            inputRef={titleInputRef}
            value={title}
            onKeyUp={handleTitleKeyup}
            updating={titleUpdating}
          />
        </div>
        <div
          className="w-12 min-h-[1.5rem] hover:cursor-pointer relative"
          onClick={handleAssignedMemberUpdateOpen}
        >
          <div className="w-full min-h-[1.5rem] " ref={assignedMemberRef}>
            {assignedMemberId && (
              <p className="truncate" title={assignedMemberName}>
                {assignedMemberName}
              </p>
            )}
          </div>
          {assignedMemberUpdating && (
            <AssignedMemberDropdown onOptionClick={updateAssignedMember} />
          )}
        </div>
        <div
          className="w-16 min-h-[1.5rem] hover:cursor-pointer"
          ref={expectedTimeRef}
          onClick={() => handleExpectedTimeUpdating(true)}
        >
          <NumberInputColumn
            updating={expectedTimeUpdating}
            inputRef={expectedTimeInputRef}
            value={expectedTime}
            onKeyUp={handleExpectedTimeKeyup}
          />
        </div>
        <div
          className="w-16 min-h-[1.5rem] hover:cursor-pointer"
          ref={actualTimeRef}
          onClick={() => handleActualTimeUpdating(true)}
        >
          <NumberInputColumn
            updating={actualTimeUpdating}
            inputRef={actualTimeInputRef}
            value={actualTime}
            onKeyUp={handleActualTimeKeyup}
          />
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
        <div className="absolute z-10 px-2 py-1 bg-white rounded-md shadow-box">
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

export default TaskBlock;
