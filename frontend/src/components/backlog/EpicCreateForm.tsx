import { ChangeEvent, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { LexoRank } from "lexorank";
import useEpicEmitEvent from "../../hooks/pages/backlog/useEpicEmitEvent";
import { CATEGORY_COLOR } from "../../constants/backlog";
import getNewColor from "../../utils/getNewColor";
import Check from "../../assets/icons/check.svg?react";
import Closed from "../../assets/icons/closed.svg?react";

interface EpicCreateFormProps {
  onCloseClick: () => void;
}

const EpicCreateForm = ({ onCloseClick }: EpicCreateFormProps) => {
  const [value, setValue] = useState("");
  const [epicColor] = useState(getNewColor(Object.keys(CATEGORY_COLOR)));
  const { socket }: { socket: Socket } = useOutletContext();
  const { emitEpicCreateEvent } = useEpicEmitEvent(socket);

  const inputElementRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;

    setValue(value);
  };

  const handleSubmit = () => {
    if (value.length > 10) {
      alert("에픽 이름은 10자 이하여야 합니다.");
      return;
    }

    emitEpicCreateEvent({
      name: value,
      color: epicColor,
      rankValue: LexoRank.middle().toString(),
    });
    setValue("");
    onCloseClick();
  };

  return (
    <form className="flex items-center w-full py-1" onSubmit={handleSubmit}>
      <input
        className="w-full mr-3 bg-gray-200 rounded-sm focus:outline-none hover:cursor-pointer"
        type="text"
        ref={inputElementRef}
        onChange={handleInputChange}
      />
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

export default EpicCreateForm;
