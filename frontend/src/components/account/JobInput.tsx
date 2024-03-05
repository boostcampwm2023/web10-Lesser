import { useEffect } from "react";
import useDropdown from "../../common/dropdown/useDropdown";
import { JOB_INPUT_INFO, SIGNUP_STEP } from "../../constants/account";
import NextStepButton from "./NextStepButton";

interface JobInputProps {
  currentStep: { NUMBER: number; NAME: string };
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
  jobRef: React.MutableRefObject<string | null>;
}

const JobInput = ({ currentStep, setCurrentStep, jobRef }: JobInputProps) => {
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: JOB_INPUT_INFO.PLACEHOLDER,
    options: JOB_INPUT_INFO.OPTIONS,
  });

  const handleNextButtonClick = () => {
    setCurrentStep(SIGNUP_STEP.STEP3);
  };

  useEffect(() => {
    jobRef.current = selectedOption;
  }, [selectedOption]);

  return (
    <div
      className={`flex h-[90%] ${
        currentStep !== SIGNUP_STEP.STEP3 ? "items-center" : "items-end"
      }`}
    >
      <div id="job-input-box" className="w-[80%] flex gap-4 items-center">
        <span className="text-3xl font-semibold text-dark-gray">
          저의 주요 직무는
        </span>
        <Dropdown
          buttonClassName={`w-[14.25rem] h-[3.25rem] rounded-xl bg-middle-green text-white text-m shadow-box ${
            selectedOption && "font-bold"
          }`}
          containerClassName="w-[14.25rem] h-[18.5rem] overflow-y-auto shadow-box"
          itemClassName="text-2xl text-text-gray py-3 px-9 hover:bg-middle-green hover:text-white hover:font-bold"
        />
        <span className="text-3xl font-semibold text-dark-gray">입니다</span>
      </div>
      {currentStep === SIGNUP_STEP.STEP2 && (
        <NextStepButton onNextButtonClick={handleNextButtonClick}>
          Next
        </NextStepButton>
      )}
    </div>
  );
};

export default JobInput;
