import { useEffect } from "react";
import useDropdown from "../../hooks/common/dropdown/useDropdown";
import NextStepButton from "../common/NextStepButton";
import { JOB_INPUT_INFO, SIGNUP_STEP } from "../../constants/account";
import useWheelDown from "../../hooks/pages/account/useWheelDown";
import useWheelUp from "../../hooks/pages/account/useWheelUp";

interface JobInputProps {
  currentStepNumber: number;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
  positionValueRef: React.MutableRefObject<string | null>;
}

const PositionInput = ({
  currentStepNumber,
  setCurrentStep,
  positionValueRef,
}: JobInputProps) => {
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: JOB_INPUT_INFO.PLACEHOLDER,
    options: JOB_INPUT_INFO.OPTIONS,
  });

  const goToNextStep = () => {
    setCurrentStep(SIGNUP_STEP.STEP3);
  };

  const goToPrevStep = () => {
    setCurrentStep(SIGNUP_STEP.STEP1);
  };

  useEffect(() => {
    positionValueRef.current = selectedOption;
    if (selectedOption) {
      setCurrentStep(SIGNUP_STEP.STEP3);
    }
  }, [selectedOption]);

  useWheelDown({
    currentStepNumber,
    targetStepNumber: SIGNUP_STEP.STEP1.NUMBER,
    dependency: selectedOption,
    goToNextStep,
  });

  useWheelUp({
    currentStepNumber,
    targetStepNumber: SIGNUP_STEP.STEP1.NUMBER,
    goToPrevStep,
  });

  return (
    <div
      className={`flex gap-[4.375rem] h-[90%] ${
        currentStepNumber !== SIGNUP_STEP.STEP3.NUMBER
          ? "items-center"
          : "items-end"
      }`}
    >
      <div
        id="position-input-box"
        className="min-w-[567px] flex gap-4 items-center"
      >
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
      <div className="min-w-[6.875rem] self-end">
        {currentStepNumber !== SIGNUP_STEP.STEP3.NUMBER && selectedOption && (
          <NextStepButton onNextButtonClick={goToNextStep}>Next</NextStepButton>
        )}
      </div>
    </div>
  );
};

export default PositionInput;
