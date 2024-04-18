import { useRef, useState } from "react";
import NextStepButton from "../common/NextStepButton";
import {
  MAX_INPUT_LENGTH,
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
  onNextButtonClick,
  label,
  inputRef,
  buttonContent,
  containerHeight,
}: ProjectCreateInputProps) => {
  const [valid, setValid] = useState<boolean | null>(null);
  const inputElement = useRef<HTMLInputElement>(null);
  const targetStepIsProjectName = elementId === PROJECT_NAME_INPUT_ID;

  const handleInputChange = () => {
    const value = inputElement.current?.value.trim();

    if (value && value.length <= MAX_INPUT_LENGTH) {
      setValid(true);
      return;
    }

    if (!value) {
      setValid(null);
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

  const handleEnterDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && valid) {
      handleNextButtonClick();
    }
  };

  return (
    <div
      className={`flex gap-[4.375rem] h-[${containerHeight}%] ${
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
          <div className="inline">
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
              } h-[3rem] border-b-2 focus:outline-none focus:border-b-3 font-semibold text-3xl text-middle-gree ${
                valid && "border-b-3 border-middle-green"
              } ${
                valid !== null && !valid
                  ? "border-b-3 border-error-red focus:border-error-red"
                  : "focus:border-middle-green"
              }`}
            />
            {valid !== null && !valid && (
              <p className="font-bold text-error-red text-xxs">
                길이가 너무 길어요
              </p>
            )}
          </div>
          <p className="self-start mt-3 ml-[2px] text-3xl font-semibold w-fit text-dark-gray">
            입니다
          </p>
        </div>
      </div>
      <div className="min-w-[6.875rem] self-end">
        {valid && targetStepIsCurrentStep && (
          <NextStepButton onNextButtonClick={handleNextButtonClick}>
            {buttonContent}
          </NextStepButton>
        )}
      </div>
    </div>
  );
};

export default ProjectCreateInput;
