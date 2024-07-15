import { ChangeEvent, FormEvent, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import Check from "../../assets/icons/check.svg?react";
import Closed from "../../assets/icons/closed.svg?react";
import useTaskEmitEvent from "../../hooks/pages/backlog/useTaskEmitEvent";
import { TaskForm } from "../../types/common/backlog";

interface TaskCreateFormProps {
  onCloseClick: () => void;
  storyId: number;
}

const TaskCreateForm = ({ onCloseClick, storyId }: TaskCreateFormProps) => {
  const [taskFormData, setTaskFormData] = useState<TaskForm>({
    title: "",
    expectedTime: null,
    actualTime: null,
    status: "시작전",
    assignedMemberId: null,
    storyId,
  });
  const { socket }: { socket: Socket } = useOutletContext();
  const { emitTaskCreateEvent } = useTaskEmitEvent(socket);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTaskFormData({ ...taskFormData, title: value });
  };

  const handleExpectedTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTaskFormData({ ...taskFormData, expectedTime: Number(value) });
  };

  const handleActualTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTaskFormData({ ...taskFormData, actualTime: Number(value) });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let { title, actualTime, expectedTime } = taskFormData;

    if (title.length > 100) {
      alert("제목은 100자 이내여야 합니다.");
      return;
    }

    if (
      typeof expectedTime === "number" &&
      (expectedTime < 0 || expectedTime >= 100)
    ) {
      alert("예상 시간은 0이상, 100 미만이어야 합니다.");
      return;
    }

    if (
      typeof actualTime === "number" &&
      (actualTime < 0 || actualTime >= 100)
    ) {
      alert("실제 시간은 0이상, 100 미만이어야 합니다.");
      return;
    }

    if (actualTime === "") {
      actualTime = null;
    }

    if (expectedTime === "") {
      expectedTime = null;
    }

    emitTaskCreateEvent({ ...taskFormData, actualTime, expectedTime });
    onCloseClick();
  };

  return (
    <form className="flex items-center justify-between px-1 py-1 border-b">
      <div className="w-[4rem]" />
      <input
        type="text"
        className="w-[25rem] bg-gray-200 rounded-sm focus:outline-none px-1"
        onChange={handleTitleChange}
      />
      <div className="w-12"></div>
      <div className="w-16 ">
        <input
          type="number"
          className="max-w-full px-1 text-right bg-gray-200 rounded-sm no-arrows focus:outline-none"
          onChange={handleExpectedTimeChange}
          value={
            taskFormData.expectedTime === null ? "" : taskFormData.expectedTime
          }
        />
      </div>
      <div className="w-16 ">
        <input
          type="number"
          className="max-w-full px-1 text-right bg-gray-200 rounded-sm no-arrows focus:outline-none"
          onChange={handleActualTimeChange}
          value={
            taskFormData.actualTime === null ? "" : taskFormData.actualTime
          }
        />
      </div>
      <div className="w-[6.25rem]">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-6 h-6 rounded-md bg-confirm-green"
            type="button"
            onClick={handleSubmit}
          >
            <Check width={20} height={20} stroke="white" />
          </button>
          <button
            className="flex items-center justify-center w-6 h-6 rounded-md bg-error-red"
            type="button"
            onClick={onCloseClick}
          >
            <Closed stroke="white" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskCreateForm;
