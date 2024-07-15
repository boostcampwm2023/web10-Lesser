import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import useDropdownState from "../../hooks/common/dropdown/useDropdownState";
import useBacklogInputChange from "../../hooks/pages/backlog/useBacklogInputChange";
import useTaskEmitEvent from "../../hooks/pages/backlog/useTaskEmitEvent";
import { BacklogStatusType, TaskDTO } from "../../types/DTO/backlogDTO";
import AssignedMemberDropdown from "./AssignedMemberDropdown";
import BacklogStatusChip from "./BacklogStatusChip";
import BacklogStatusDropdown from "./BacklogStatusDropdown";
import useMemberStore from "../../stores/useMemberStore";
import { useMemo } from "react";

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
  } = useBacklogInputChange(updateTitle);
  const {
    inputContainerRef: expectedTimeRef,
    inputElementRef: expectedTimeInputRef,
    updating: expectedTimeUpdating,
    handleUpdating: handleExpectedTimeUpdating,
  } = useBacklogInputChange(updateExpectedTime);
  const {
    inputContainerRef: actualTimeRef,
    inputElementRef: actualTimeInputRef,
    updating: actualTimeUpdating,
    handleUpdating: handleActualTimeUpdating,
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
  const { emitTaskUpdateEvent } = useTaskEmitEvent(socket);

  const assignedMemberName = useMemo(() => {
    if (assignedMemberId === null) {
      return "";
    }

    if (myInfo.id === assignedMemberId) {
      return myInfo.username;
    }

    return partialMemberList.filter(({ id }) => id === assignedMemberId)[0]
      .username;
  }, [assignedMemberId, partialMemberList]);

  function updateTitle<T>(data: T) {
    if (!data || data === title) {
      return;
    }

    if ((data as string).length > 100) {
      alert("태스크 타이틀은 100자 이하여야 합니다.");
      return;
    }

    emitTaskUpdateEvent({ id, title: data as string });
  }
  function updateExpectedTime<T>(data: T) {
    if (!data || data === String(expectedTime)) {
      return;
    }

    if (data === "") {
      emitTaskUpdateEvent({ id, expectedTime: null });
      return;
    }

    if (!isNaN(Number(data)) && (Number(data) >= 100 || Number(data) < 0)) {
      alert(
        "예상 시간은 0이상, 100미만의 정수 또는 소수점 한 자릿수여야 합니다."
      );
      return;
    }

    emitTaskUpdateEvent({ id, expectedTime: Number(data) });
  }
  function updateActualTime<T>(data: T) {
    if (!data || data === String(actualTime)) {
      return;
    }

    if (data === "") {
      emitTaskUpdateEvent({ id, actualTime: null });
      return;
    }

    if (!isNaN(Number(data)) && (Number(data) >= 100 || Number(data) < 0)) {
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

  return (
    <div className="flex items-center justify-between py-1 border-b">
      <p className="w-[4rem]">Task-{displayId}</p>
      <div
        className="w-[25rem] min-h-[1.5rem] hover:cursor-pointer"
        ref={titleRef}
        onClick={() => handleTitleUpdating(true)}
      >
        {titleUpdating ? (
          <input
            className="w-full min-w-[1rem] focus:outline-none rounded-sm bg-gray-200 hover:cursor-pointer"
            ref={titleInputRef}
            defaultValue={title}
            type="text"
          />
        ) : (
          <span>{title}</span>
        )}
      </div>
      <div
        className="w-12 min-h-[1.5rem] hover:cursor-pointer relative"
        onClick={handleAssignedMemberUpdateOpen}
      >
        <div className="w-full min-h-[1.5rem]" ref={assignedMemberRef}>
          {assignedMemberId && <p>{assignedMemberName}</p>}
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
        {expectedTimeUpdating ? (
          <input
            className="w-full min-w-[1rem] no-arrows text-right focus:outline-none rounded-sm bg-gray-200 hover:cursor-pointer"
            ref={expectedTimeInputRef}
            defaultValue={expectedTime === null ? "" : expectedTime}
            type="number"
          />
        ) : (
          <p className="max-w-full text-right">{expectedTime}</p>
        )}
      </div>
      <div
        className="w-16 min-h-[1.5rem] hover:cursor-pointer"
        ref={actualTimeRef}
        onClick={() => handleActualTimeUpdating(true)}
      >
        {actualTimeUpdating ? (
          <input
            className="w-full min-w-[1rem] no-arrows text-right focus:outline-none rounded-sm bg-gray-200 hover:cursor-pointer"
            ref={actualTimeInputRef}
            defaultValue={actualTime === null ? "" : actualTime}
            type="number"
          />
        ) : (
          <p className="min-w-full text-right">{actualTime}</p>
        )}
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
  );
};

export default TaskBlock;
