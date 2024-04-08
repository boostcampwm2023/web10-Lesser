import { MouseEventHandler } from "react";

const LandingLinkModal = ({ close }: { close: () => void }) => {
  const handleCloseClick: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = ({ target, currentTarget }: React.MouseEvent) => {
    if (target !== currentTarget) return;
    close();
  };

  return (
    <div
      className="top-0 left-0 absolute w-screen h-screen flex justify-center items-center bg-black bg-opacity-30"
      onClick={handleCloseClick}
    >
      <div className="w-[40.625rem] bg-white flex flex-col p-9 gap-9 rounded-lg shadow-box">
        <p className="text-m font-bold">| 링크 추가하기</p>
        <div className="flex gap-8 items-center">
          <p className="text-xs shrink-0">링크 주소</p>
          <input className="rounded-lg w-full border border-text-gray text-xs py-1 px-2" />
        </div>
        <div className="flex gap-8 items-center">
          <p className="text-xs shrink-0">링크 이름</p>
          <input className="rounded-lg w-full border border-text-gray text-xs py-1 px-2" />
        </div>
        <div className="flex gap-3 justify-end">
          <button className="rounded-lg bg-middle-green text-white text-xs px-3 py-1 hover:bg-dark-green">
            완료
          </button>
          <button
            className="rounded-lg border border-light-gray text-xs px-3 py-1 hover:bg-light-gray"
            onClick={handleCloseClick}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingLinkModal;
