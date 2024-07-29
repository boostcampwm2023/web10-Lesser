import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Check from "../../assets/icons/check.svg?react";
import Closed from "../../assets/icons/closed.svg?react";
import CategoryChip from "./CategoryChip";
import { StoryForm } from "../../types/common/backlog";
import useStoryEmitEvent from "../../hooks/pages/backlog/useStoryEmitEvent";
import { Socket } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import EpicDropdown from "./EpicDropdown";
import { EpicCategoryDTO } from "../../types/DTO/backlogDTO";
import useDropdownState from "../../hooks/common/dropdown/useDropdownState";

interface StoryCreateFormProps {
  onCloseClick: () => void;
  epicList: EpicCategoryDTO[];
}

const StoryCreateForm = ({ onCloseClick, epicList }: StoryCreateFormProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const [{ title, point, epicId, status }, setStoryFormData] =
    useState<StoryForm>({
      title: "",
      point: undefined,
      status: "시작전",
      epicId: undefined,
    });
  const { open, handleClose, handleOpen, dropdownRef } = useDropdownState();
  const { emitStoryCreateEvent } = useStoryEmitEvent(socket);

  const handleTitleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setStoryFormData({ title: value, point, epicId, status });
  };

  const handlePointChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const newPoint = value === "" ? undefined : Number(value);
    setStoryFormData({ title, point: newPoint, epicId, status });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (epicId === undefined) {
      alert("에픽을 지정해주세요.");
      return;
    }

    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (point === undefined) {
      alert("포인트를 입력해주세요.");
      return;
    }

    if (title.length > 100) {
      alert("스토리 타이틀은 100자 이하여야 합니다.");
      return;
    }

    if (point < 0 || point > 100) {
      alert("포인트는 0이상 100이하여야 합니다.");
      return;
    }

    if (!Number.isInteger(point)) {
      alert("포인트는 정수여야 합니다.");
      return;
    }

    emitStoryCreateEvent({ title, status, epicId, point });
    onCloseClick();
  };

  const handleEpicChange = (selectedEpicId: number | undefined) => {
    setStoryFormData({ title, status, point, epicId: selectedEpicId });
    handleClose();
  };

  const handleEpicColumnClick = () => {
    if (!open) {
      handleOpen();
    }
  };

  const selectedEpic = useMemo(
    () => epicList.filter(({ id }) => id === epicId)[0],
    [epicId, epicList]
  );

  useEffect(() => {
    if (!epicList.filter(({ id }) => id === epicId).length) {
      setStoryFormData({ title, point, status, epicId: undefined });
    }
  }, [epicList]);

  return (
    <form
      className="flex items-center w-full py-1 border-t border-b"
      onSubmit={handleSubmit}
    >
      <div
        className="w-[5rem] min-h-[1.75rem] bg-light-gray rounded-md mr-7 hover:cursor-pointer relative"
        onClick={handleEpicColumnClick}
        ref={dropdownRef}
      >
        {epicId && (
          <CategoryChip
            content={selectedEpic?.name}
            bgColor={selectedEpic?.color}
          />
        )}
        {open && (
          <EpicDropdown
            selectedEpic={selectedEpic}
            epicList={epicList}
            onEpicChange={handleEpicChange}
          />
        )}
      </div>
      <input
        className="w-[34.7rem] h-[1.75rem] mr-[1.5rem] bg-light-gray rounded-md focus:outline-none"
        type="text"
        value={title}
        onChange={handleTitleChange}
      />
      <div className="flex items-center mr-[2.8rem] ">
        <input
          className="w-24 h-[1.75rem] mr-1 text-right rounded-md bg-light-gray no-arrows focus:outline-none"
          type="number"
          id="point-number"
          value={point}
          onChange={handlePointChange}
        />
        <label htmlFor="point-number" className="">
          POINT
        </label>
      </div>
      <div className="w-[4rem] mr-[2.76rem] text-right">
        <span>0%</span>
      </div>
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
    </form>
  );
};

export default StoryCreateForm;
