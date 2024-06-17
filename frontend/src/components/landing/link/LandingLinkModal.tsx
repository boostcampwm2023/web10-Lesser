import { ChangeEvent, MouseEventHandler, useState } from "react";
import isValidURL from "../../../utils/isValidURL";

const LandingLinkModal = ({ close }: { close: () => void }) => {
  const [linkData, setLinkData] = useState({
    url: "",
    description: "",
  });

  const handleInputChange = (
    { target }: ChangeEvent<HTMLInputElement>,
    field: "url" | "description"
  ) => {
    const { value } = target;

    setLinkData({ ...linkData, [field]: decodeURI(value) });
  };

  const handleConfirmClick = () => {
    const { url, description } = linkData;
    const errorTextList = [];

    if (!isValidURL(url)) {
      errorTextList.push("유효하지 않은 URL입니다.");
    }

    if (url.trim().length > 255 || description.trim().length > 255) {
      errorTextList.push("링크 주소와 이름은 255자 이하여야 합니다.");
    }

    if (url.trim() === "" || description.trim() === "") {
      errorTextList.push("링크 주소와 이름은 모두 입력되어야 합니다.");
    }

    if (errorTextList.length) {
      alert(errorTextList.join("\n"));
      return;
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

  return (
    <div
      className="absolute top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-30"
      onClick={handleCloseClick}
    >
      <div className="w-[40.625rem] bg-white flex flex-col p-9 gap-9 rounded-lg shadow-box">
        <p className="font-bold text-m">| 링크 추가하기</p>
        <div className="flex items-center gap-8">
          <p className="text-xs shrink-0">링크 주소</p>
          <input
            className="w-full px-2 py-1 text-xs border rounded-lg border-text-gray"
            value={linkData.url}
            onChange={(event) => handleInputChange(event, "url")}
          />
        </div>
        <div className="flex items-center gap-8">
          <p className="text-xs shrink-0">링크 이름</p>
          <input
            className="w-full px-2 py-1 text-xs border rounded-lg border-text-gray"
            value={linkData.description}
            onChange={(event) => handleInputChange(event, "description")}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-1 text-xs text-white rounded-lg bg-middle-green hover:bg-dark-green"
            onClick={handleConfirmClick}
          >
            완료
          </button>
          <button
            className="px-3 py-1 text-xs border rounded-lg border-light-gray hover:bg-light-gray"
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
