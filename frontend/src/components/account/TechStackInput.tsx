import { useState } from "react";
import { useModal } from "../../common/modal/useModal";
import TechStackModal from "./TechStackModal";
import plus from "../../assets/icons/plus.svg";
import NextStepButton from "./NextStepButton";
import CategoryButton from "../common/CategoryButton";

interface TechStackInputProps {
  techRef: React.MutableRefObject<string[]>;
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
    <div id="tech" className="h-[100%] flex items-center">
      <div className="w-[80%]">
        <p className="mb-3 text-3xl font-semibold text-dark-gray">
          저의 주요 기술 스택은
        </p>
        <div className="flex flex-wrap gap-3 mb-3">
          {techStackList.map((techStack) => (
            <CategoryButton
              category={techStack}
              onCloseButtonClick={handleCloseButtonClick}
            />
          ))}
        </div>
        <button
          className="w-[11.25rem] h-[3.25rem] bg-middle-green rounded-xl text-m text-white mb-3 flex items-center shadow-box pl-3 pr-9"
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
      <NextStepButton onNextButtonClick={onSignupButtonClick}>
        가입하기
      </NextStepButton>
    </div>
  );
};

export default TechStackInput;
