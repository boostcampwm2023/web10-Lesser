import { useRef, useState } from "react";
import NextStepButton from "../common/NextStepButton";
import {
  PROJECT_CREATE_STEP,
  PROJECT_NAME_INPUT_ID,
} from "../../constants/projects";
import { Step } from "../../types/common/common";

interface ProjectCreateInputProps {
  elementId: string;
  targetStepIsCurrentStep: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
  onNextButtonClick: () => void;
  label: string;
  inputRef: React.MutableRefObject<string>;
  buttonContent: string;
  containerHeight: number;
}

const ProjectCreateInput = ({
  elementId,
  targetStepIsCurrentStep,
  setCurrentStep,
  onNextButtonClick,
  label,
  inputRef,
  buttonContent,
  containerHeight,
}: ProjectCreateInputProps) => {
  const [valid, setValid] = useState<boolean>(false);
  const inputElement = useRef<HTMLInputElement>(null);
  const targetStepIsProjectName = elementId === PROJECT_NAME_INPUT_ID;

  const handleInputChange = () => {
    const value = inputElement.current?.value.trim();

    if (value) {
      setValid(true);
      return;
    }

    setValid(false);
  };

  const handleNextButtonClick = () => {
    const value = inputElement.current?.value.trim();

    if (value && inputElement.current) {
      inputElement.current.value = value;
      inputRef.current = value;
    }

    onNextButtonClick();
  };

  const handleEnterDown = ({ key }: React.KeyboardEvent) => {
    if (key === "Enter" && valid) {
      setCurrentStep(PROJECT_CREATE_STEP.STEP2);
    }
  };

  return (
    <div
      className={`flex h-[${containerHeight}%] ${
        targetStepIsCurrentStep ? "items-center" : "items-end"
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
            ref={inputElement}
            autoComplete="off"
            onChange={handleInputChange}
            onKeyDown={handleEnterDown}
            className={`${
              targetStepIsProjectName ? "w-[27.5rem]" : "w-[525px]"
            } h-[3rem] border-b-2 focus:outline-none focus:border-b-3 font-semibold text-3xl text-middle-green focus:border-middle-green ${
              valid && "border-b-3 border-middle-green"
            }`}
          />

          <p className="self-end mt-3 text-3xl font-semibold w-fit text-dark-gray">
            입니다
          </p>
        </div>
      </div>
      {valid && targetStepIsCurrentStep && (
        <NextStepButton onNextButtonClick={handleNextButtonClick}>
          {buttonContent}
        </NextStepButton>
      )}
    </div>
  );
};

export default ProjectCreateInput;
