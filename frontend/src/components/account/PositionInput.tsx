import { useEffect } from "react";
import useDropdown from "../../hooks/common/dropdown/useDropdown";
import NextStepButton from "../common/NextStepButton";
import { JOB_INPUT_INFO, SIGNUP_STEP_NUMBER } from "../../constants/account";

interface JobInputProps {
  currentStepNumber: number;
  onPositionChange: (position: string) => void;
  onGoNextStep: () => void;
  changeWheelDownActive: (active: boolean) => void;
}

const PositionInput = ({
  currentStepNumber,
  onPositionChange,
  onGoNextStep,
  changeWheelDownActive,
}: JobInputProps) => {
  const { Dropdown, selectedOption } = useDropdown({
    placeholder: JOB_INPUT_INFO.PLACEHOLDER,
    options: JOB_INPUT_INFO.OPTIONS,
  });

  useEffect(() => {
    if (selectedOption) {
      onPositionChange(selectedOption);
      changeWheelDownActive(true);
      onGoNextStep();
    } else {
      changeWheelDownActive(false);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (currentStepNumber !== SIGNUP_STEP_NUMBER.STEP2) {
      return;
    }

    if (selectedOption) {
      changeWheelDownActive(true);
    } else {
      changeWheelDownActive(false);
    }
  }, [currentStepNumber]);

  return (
    <div
      className={`w-[100%] flex flex-col justify-end gap-[4.375rem] h-[90%]`}
    >
      <div
        id="position-input-box"
        className={`flex gap-4 items-center transition-all ease-in-out duration-1000 ${
          currentStepNumber !== SIGNUP_STEP_NUMBER.STEP3
            ? "mb-[25%]"
            : "mb-[-15%]"
        }`}
      >
        <span className="text-3xl font-semibold text-dark-gray">
          저의 주요 직무는
        </span>
        <Dropdown
          buttonClassName={`flex justify-space items-center min-h-[3.25rem] gap-3 pl-9 pr-2 rounded-xl bg-middle-green text-white text-m shadow-box ${
            selectedOption && "font-bold"
          }`}
          containerClassName="w-full max-h-[16rem] overflow-y-auto shadow-box rounded-b-lg scrollbar-hide"
          itemClassName="text-2xl text-text-gray py-3 px-9 hover:bg-middle-green hover:text-white hover:font-bold"
        />
        <span className="text-3xl font-semibold text-dark-gray">입니다</span>
      </div>
      <div
        className={`self-end ${
          currentStepNumber !== SIGNUP_STEP_NUMBER.STEP3 && selectedOption
            ? "visible"
            : "invisible"
        }`}
      >
        <NextStepButton onNextButtonClick={onGoNextStep}>Next</NextStepButton>
      </div>
    </div>
  );
};

export default PositionInput;
