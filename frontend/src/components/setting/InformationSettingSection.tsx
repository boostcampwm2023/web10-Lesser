import { ChangeEvent, useEffect, useMemo, useState } from "react";
import InformationInput from "./InformationInput";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import useSettingProjectInfoSocket from "../../hooks/pages/setting/useSettingProjectInfoSocket";

interface InformationSettingSectionProps {}

const InformationSettingSection = ({}: InformationSettingSectionProps) => {
  const { socket }: { socket: Socket } = useOutletContext();
  const {
    projectInfo: { title, subject },
  } = useSettingProjectInfoSocket(socket);
  const [titleValue, setTitleValue] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [subjectValue, setSubjectValue] = useState("");
  const [subjectErrorMessage, setSubjectErrorMessage] = useState("");
  const submitActivated = useMemo(
    () =>
      !(
        !titleValue ||
        !subjectValue ||
        (titleValue === title && subjectValue === subject)
      ),
    [titleValue, subjectValue]
  );

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitleValue(value);

    if (!value.trim()) {
      setTitleErrorMessage("프로젝트 이름을 입력해주세요.");
      return;
    }

    if (value.length > 255) {
      setTitleErrorMessage("프로젝트 이름이 너무 깁니다.");
      return;
    }

    setTitleErrorMessage("");
  };

  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSubjectValue(value);

    if (!value.trim()) {
      setSubjectErrorMessage("프로젝트 주제를 입력해주세요.");
      return;
    }

    if (value.length > 255) {
      setSubjectErrorMessage("프로젝트 주제가 너무 깁니다.");
      return;
    }

    setSubjectErrorMessage("");
  };

  const handleSubmit = () => {};

  useEffect(() => {
    setTitleValue(title);
    setSubjectValue(subject);
  }, [title, subject]);

  return (
    <>
      <div className="w-full mb-2">
        <p className="font-bold text-m text-middle-green">프로젝트 설정</p>
      </div>
      <div className="flex flex-col w-full">
        <InformationInput
          label="프로젝트 이름"
          inputId="title"
          inputValue={titleValue}
          errorMessage={titleErrorMessage}
          onChange={handleTitleChange}
        />
        <InformationInput
          label="프로젝트 주제"
          inputId="subject"
          inputValue={subjectValue}
          errorMessage={subjectErrorMessage}
          onChange={handleSubjectChange}
        />
        <div className="self-end relative w-[4.5rem] h-10">
          {!submitActivated && (
            <div className="absolute w-full h-full rounded-lg opacity-50 bg-slate-500"></div>
          )}

          <button
            className="w-full h-full text-xs text-white rounded-lg bg-middle-green"
            type="button"
            disabled={!submitActivated}
            onClick={handleSubmit}
          >
            저장
          </button>
        </div>
      </div>
    </>
  );
};

export default InformationSettingSection;
