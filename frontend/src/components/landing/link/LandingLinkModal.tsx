import { ChangeEvent, MouseEventHandler, useState } from "react";
import isValidURL from "../../../utils/isValidURL";
import addSchemeToURL from "../../../utils/addSchemeToURL";

interface LandingLinkModalProps {
  close: () => void;
  emitLinkCreateEvent: (content: { url: string; description: string }) => void;
}

interface ValidDataState {
  urlValid: boolean | null;
  urlValidText: string;
  descriptionValid: boolean | null;
  descriptionValidText: string;
}

const LandingLinkModal = ({
  close,
  emitLinkCreateEvent,
}: LandingLinkModalProps) => {
  const [linkData, setLinkData] = useState({
    url: "",
    description: "",
  });
  const [validData, setValidData] = useState<ValidDataState>({
    urlValid: null,
    urlValidText: "",
    descriptionValid: null,
    descriptionValidText: "",
  });

  const checkUrlValidation = (url: string): [boolean, string] => {
    if (url.trim().length === 0) {
      return [false, "링크 주소를 입력해주세요."];
    }

    if (decodeURI(addSchemeToURL(url)).length > 255) {
      return [false, "링크 주소의 길이가 너무 깁니다."];
    }

    if (!isValidURL(decodeURI(addSchemeToURL(url)))) {
      return [false, "유효하지 않은 링크 주소입니다."];
    }

    return [true, ""];
  };

  const checkDescriptionValidation = (
    description: string
  ): [boolean, string] => {
    if (description.length > 255) {
      return [false, "링크 이름의 길이가 너무 깁니다."];
    }

    if (description.trim().length === 0) {
      return [false, "링크 이름을 입력해주세요."];
    }

    return [true, ""];
  };

  const handleUrlChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const [urlValid, urlValidText] = checkUrlValidation(value);

    setLinkData({ ...linkData, url: decodeURI(value) });
    setValidData({ ...validData, urlValid, urlValidText });
  };

  const handleDescriptionChange = ({
    target,
  }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const [descriptionValid, descriptionValidText] =
      checkDescriptionValidation(value);

    setLinkData({ ...linkData, description: value });
    setValidData({ ...validData, descriptionValid, descriptionValidText });
  };

  const handleConfirmClick = () => {
    const { url, description } = linkData;
    const urlWithScheme = decodeURI(addSchemeToURL(url));
    const [urlValid, urlValidText] = checkUrlValidation(urlWithScheme);
    const [descriptionValid, descriptionValidText] =
      checkDescriptionValidation(description);

    if (!urlValid || !descriptionValid) {
      setValidData({
        urlValid,
        urlValidText,
        descriptionValid,
        descriptionValidText,
      });
      return;
    }

    emitLinkCreateEvent({ ...linkData, url: urlWithScheme });
    close();
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
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-30"
      onClick={handleCloseClick}
    >
      <div className="w-[40.625rem] bg-white flex flex-col p-9 gap-9 rounded-lg shadow-box">
        <p className="font-bold text-m">| 링크 추가하기</p>
        <div className="flex gap-8">
          <p className="text-xs shrink-0">링크 주소</p>
          <div className="w-full">
            <input
              className="w-full px-2 py-1 text-xs border rounded-lg border-text-gray"
              value={linkData.url}
              onChange={handleUrlChange}
            />
            <p className={`text-xxxs text-error-red h-[1.125rem]`}>
              {validData.urlValidText}
            </p>
          </div>
        </div>
        <div className="flex gap-8">
          <p className="text-xs shrink-0">링크 이름</p>
          <div className="w-full">
            <input
              className="w-full px-2 py-1 text-xs border rounded-lg border-text-gray"
              value={linkData.description}
              onChange={handleDescriptionChange}
            />
            <p className="text-xxxs text-error-red h-[1.125rem]">
              {validData.descriptionValidText}
            </p>
          </div>
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
