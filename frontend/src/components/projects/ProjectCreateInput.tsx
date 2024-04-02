import { ChangeEvent, useState } from "react";
import NextStepButton from "../common/NextStepButton";
import {
  PROJECT_CREATE_STEP,
  PROJECT_NAME_INPUT_ID,
} from "../../constants/projects";
import { Step } from "../../types/common";

interface ProjectCreateInputProps {
  elementId: string;
  targetStep: Step;
  currentStep: Step;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
  onNextButtonClick: () => void;
  label: string;
  inputRef: React.MutableRefObject<string>;
  buttonContent: string;
  containerHeight: number;
}

const ProjectCreateInput = ({
  elementId,
  targetStep,
  currentStep,
  setCurrentStep,
  onNextButtonClick,
  label,
  inputRef,
  buttonContent,
  containerHeight,
}: ProjectCreateInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const targetStepIsProjectName = elementId === PROJECT_NAME_INPUT_ID;

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = target.value.trim();
    setInputValue(value);
    inputRef.current = value;
  };

  const handleEnterDown = ({ key }: React.KeyboardEvent) => {
    if (key === "Enter" && inputValue) {
      setCurrentStep(PROJECT_CREATE_STEP.STEP2);
    }
  };

  return (
    <div
      className={`flex h-[${containerHeight}%] ${
        currentStep.NUMBER === targetStep.NUMBER ? "items-center" : "items-end"
      }`}
    >
      <div className="w-[80%]">
        <label
          className="text-3xl font-semibold text-dark-gray"
          htmlFor={elementId}
        >
          {label}
        </label>
        <br />
        <div
          id={`${elementId}-input-box`}
          className={`${
            targetStepIsProjectName ? "flex" : "w-[525px] flex flex-col"
          }`}
        >
          <input
            type="text"
            name={elementId}
            id={elementId}
            value={inputValue}
            autoComplete="off"
            onChange={(event) => handleInputChange(event)}
            onKeyDown={handleEnterDown}
            className={`${
              targetStepIsProjectName ? "w-[27.5rem]" : "w-[525px]"
            } h-[3rem] border-b-2 focus:outline-none focus:border-b-3 font-semibold text-3xl text-middle-green focus:border-middle-green ${
              inputValue && "border-b-3 border-middle-green"
            }`}
          />

          <p className="self-end mt-3 text-3xl font-semibold w-fit text-dark-gray">
            입니다
          </p>
        </div>
      </div>
      {inputValue && currentStep.NUMBER === targetStep.NUMBER && (
        <NextStepButton onNextButtonClick={onNextButtonClick}>
          {buttonContent}
        </NextStepButton>
      )}
    </div>
  );
};

export default ProjectCreateInput;
