import { useState } from "react";
import { useModal } from "../../hooks/common/modal/useModal";
import TechStackModal from "./TechStackModal";
import plus from "../../assets/icons/plus.svg";
import NextStepButton from "../common/NextStepButton";
import CategoryButton from "../common/CategoryButton";

interface TechStackInputProps {
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
  techRef: React.MutableRefObject<null | string[]>;
  onSignupButtonClick: () => void;
}

const TechStackInput = ({
  techRef,
  onSignupButtonClick,
}: TechStackInputProps) => {
  const { open, close } = useModal();
  const [techStackList, setTechStackList] = useState<string[]>([]);

  const handleCloseButtonClick = (techStack: string) => {
    const newTechStackList = [...techStackList];
    const targetIndex = newTechStackList.indexOf(techStack);
    newTechStackList.splice(targetIndex, 1);
    techRef.current = newTechStackList;
    setTechStackList(newTechStackList);
  };

  return (
    <div id="tech" className="h-[90%] flex items-center gap-[4.375rem]">
      <div className="w-[80%]">
        <p className="mb-3 text-3xl font-semibold text-dark-gray">
          저의 주요 기술 스택은
        </p>
        <div className="flex flex-wrap gap-3 mb-3">
          {techStackList.map((techStack) => (
            <CategoryButton
              category={techStack}
              onCloseButtonClick={handleCloseButtonClick}
              key={techStack}
            />
          ))}
        </div>
        <button
          className="w-[11.25rem] h-[3.25rem] bg-middle-green rounded-xl text-m text-white mb-3 flex items-center gap-3 shadow-box pl-3 pr-9"
          type="button"
          onClick={() =>
            open(<TechStackModal {...{ techRef, close, setTechStackList }} />)
          }
        >
          <img src={plus} alt="plus" />
          추가하기
        </button>
        <p className="text-3xl font-semibold text-dark-gray">입니다</p>
      </div>
      <div className="min-w-[6.875rem] self-end">
        {techStackList.length !== 0 && (
          <NextStepButton onNextButtonClick={onSignupButtonClick}>
            가입하기
          </NextStepButton>
        )}
      </div>
    </div>
  );
};

export default TechStackInput;
