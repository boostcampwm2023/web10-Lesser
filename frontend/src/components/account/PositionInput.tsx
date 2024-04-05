import { useEffect } from "react";
import useDropdown from "../../hooks/common/dropdown/useDropdown";
import NextStepButton from "../common/NextStepButton";
import { JOB_INPUT_INFO, SIGNUP_STEP } from "../../constants/account";

interface JobInputProps {
  currentStepNumber: number;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
  positionRef: React.MutableRefObject<string | null>;
}

const PositionInput = ({
  currentStepNumber,
  setCurrentStep,
  positionRef,
}: JobInputProps) => {
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: JOB_INPUT_INFO.PLACEHOLDER,
    options: JOB_INPUT_INFO.OPTIONS,
  });

  const handleNextButtonClick = () => {
    setCurrentStep(SIGNUP_STEP.STEP3);
  };

  useEffect(() => {
    positionRef.current = selectedOption;
    if (selectedOption) {
      setCurrentStep(SIGNUP_STEP.STEP3);
    }
  }, [selectedOption]);

  return (
    <div
      className={`flex h-[90%] ${
        currentStepNumber !== SIGNUP_STEP.STEP3.NUMBER
          ? "items-center"
          : "items-end"
      }`}
    >
      <div id="position-input-box" className="w-[80%] flex gap-4 items-center">
        <span className="text-3xl font-semibold text-dark-gray">
          저의 주요 직무는
        </span>
        <Dropdown
          buttonClassName={`flex items-center w-[16rem] min-h-[3.25rem] gap-3 pl-9 rounded-xl bg-middle-green text-white text-m shadow-box ${
            selectedOption && "font-bold"
          }`}
          containerClassName="w-[16rem] max-h-[16rem] overflow-y-auto shadow-box rounded-b-lg scrollbar-hide"
          itemClassName="text-2xl text-text-gray py-3 px-9 hover:bg-middle-green hover:text-white hover:font-bold"
        />
        <span className="text-3xl font-semibold text-dark-gray">입니다</span>
      </div>
      {currentStepNumber !== SIGNUP_STEP.STEP3.NUMBER && selectedOption && (
        <NextStepButton onNextButtonClick={handleNextButtonClick}>
          Next
        </NextStepButton>
      )}
    </div>
  );
};

export default PositionInput;
