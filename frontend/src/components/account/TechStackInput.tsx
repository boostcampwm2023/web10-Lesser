import { useModal } from "../../hooks/common/modal/useModal";
import TechStackModal from "./TechStackModal";
import plus from "../../assets/icons/plus.svg";
import NextStepButton from "../common/NextStepButton";
import CategoryButton from "../common/CategoryButton";

interface TechStackInputProps {
  currentStepNumber: number;
  techStack: null | string[];
  onAddTechStack: (techStack: string) => void;
  onDeleteTechStack: (techStack: string) => void;
  onSignupButtonClick: () => void;
}

const TechStackInput = ({
  techStack,
  onAddTechStack,
  onDeleteTechStack,
  onSignupButtonClick,
}: TechStackInputProps) => {
  const { open, close } = useModal();

  return (
    <div className="w-[100%] h-[90%] flex flex-col justify-between gap-[4.375rem]">
      <div className="w-[80%] mt-[20%]">
        <p className="mb-3 text-3xl font-semibold text-dark-gray">
          저의 주요 기술 스택은
        </p>
        <div className="max-w-[42.5rem] max-h-[10rem] flex flex-wrap gap-3 mb-3 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-track-rounded-full">
          {techStack?.map((techStack) => (
            <CategoryButton
              category={techStack}
              onCloseButtonClick={onDeleteTechStack}
              key={techStack}
            />
          ))}
        </div>
        <button
          className="w-[11.25rem] h-[3.25rem] bg-middle-green rounded-xl text-m text-white mb-3 flex items-center gap-3 shadow-box pl-3 pr-9"
          type="button"
          onClick={() =>
            open(<TechStackModal {...{ close, onAddTechStack }} />)
          }
        >
          <img src={plus} alt="plus" />
          추가하기
        </button>
        <p className="text-3xl font-semibold text-dark-gray">입니다</p>
      </div>
      <div
        className={`self-end ${
          techStack && techStack?.length !== 0 ? "visible" : "invisible"
        }`}
      >
        <NextStepButton onNextButtonClick={onSignupButtonClick}>
          가입하기
        </NextStepButton>
      </div>
    </div>
  );
};

export default TechStackInput;
