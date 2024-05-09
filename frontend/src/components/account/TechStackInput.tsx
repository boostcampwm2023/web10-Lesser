import { useEffect, useState } from "react";
import { useModal } from "../../hooks/common/modal/useModal";
import TechStackModal from "./TechStackModal";
import plus from "../../assets/icons/plus.svg";
import NextStepButton from "../common/NextStepButton";
import CategoryButton from "../common/CategoryButton";
import { SIGNUP_STEP } from "../../constants/account";
import useDebounce from "../../hooks/common/useDebounce";

interface TechStackInputProps {
  currentStepNumber: number;
  techValueRef: React.MutableRefObject<null | string[]>;
  techStackElementRef: React.MutableRefObject<HTMLDivElement | null>;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
  onSignupButtonClick: () => void;
}

const TechStackInput = ({
  currentStepNumber,
  techValueRef,
  techStackElementRef,
  setCurrentStep,
  onSignupButtonClick,
}: TechStackInputProps) => {
  const { open, close } = useModal();
  const [techStackList, setTechStackList] = useState<string[]>([]);
  const debounce = useDebounce();

  const handleCloseButtonClick = (techStack: string) => {
    const newTechStackList = [...techStackList];
    const targetIndex = newTechStackList.indexOf(techStack);
    newTechStackList.splice(targetIndex, 1);
    techValueRef.current = newTechStackList;
    setTechStackList(newTechStackList);
  };

  useEffect(() => {
    const handleWheelEvent = (event: WheelEvent) => {
      if (currentStepNumber !== SIGNUP_STEP.STEP3.NUMBER) {
        return;
      }

      debounce(100, () => {
        const upScrolled = event.deltaY < 0;

        if (upScrolled) {
          setCurrentStep(SIGNUP_STEP.STEP2);
        }
      });
    };

    window.addEventListener("wheel", handleWheelEvent);

    return () => {
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, [currentStepNumber]);

  return (
    <div
      ref={techStackElementRef}
      className="h-[90%] flex items-center gap-[4.375rem]"
    >
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
            open(
              <TechStackModal {...{ techValueRef, close, setTechStackList }} />
            )
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
