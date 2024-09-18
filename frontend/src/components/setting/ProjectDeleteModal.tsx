import { ChangeEvent, MouseEventHandler, useState } from "react";
import useSettingProjectSocket from "../../hooks/pages/setting/useSettingProjectSocket";
import Closed from "../../assets/icons/closed.svg?react";
import { Socket } from "socket.io-client";

interface ProjectDeleteModalProps {
  projectTitle: string;
  socket: Socket;
  close: () => void;
}

const ProjectDeleteModal = ({
  projectTitle,
  socket,
  close,
}: ProjectDeleteModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const { emitProjectDeleteEvent } = useSettingProjectSocket(socket);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);

    if (value === projectTitle) {
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
  };

  const handleCloseClick: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = ({ target, currentTarget }: React.MouseEvent) => {
    if (target !== currentTarget) {
      return;
    }
    close();
  };

  const handleDeleteButtonClick = () => {
    if (confirmed) {
      emitProjectDeleteEvent();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-30"
      onClick={handleCloseClick}
    >
      <div className="px-6 py-7 bg-white rounded-lg w-[23.75rem] h-fit">
        <div className="flex justify-between w-full mb-2">
          <p className="font-bold text-m">|프로젝트 삭제</p>
          <button type="button" onClick={close}>
            <Closed width={32} height={32} stroke="black" />
          </button>
        </div>
        <p className="mb-10 text-lg">프로젝트 삭제 후 되돌릴 수 없습니다.</p>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold select-none">
            삭제하시려면 "{projectTitle}"을(를) 입력해주세요.
          </p>
          <input
            className="w-full px-1 text-sm border rounded border-error-red outline-error-red"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <div
            className={`${
              !confirmed ? "hover:cursor-not-allowed" : ""
            } h-7 relative`}
          >
            {!confirmed && (
              <div className="absolute w-full h-full bg-black rounded opacity-40"></div>
            )}
            <button
              className={`w-full h-full text-sm text-center text-white rounded ${
                !confirmed ? "bg-gray-300" : "bg-error-red"
              }`}
              type="button"
              disabled={!confirmed}
              onClick={handleDeleteButtonClick}
            >
              프로젝트 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeleteModal;
