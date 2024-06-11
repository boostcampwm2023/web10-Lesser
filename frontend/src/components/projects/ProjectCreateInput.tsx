import { ChangeEvent, useEffect, useRef, useState } from "react";
import NextStepButton from "../common/NextStepButton";
import {
  MAX_INPUT_LENGTH,
  PROJECT_NAME_INPUT_ID,
} from "../../constants/projects";

interface ProjectCreateInputProps {
  elementId: string;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  targetStepIsCurrentStep: boolean;
  onNextButtonClick: () => void;
  changeWheelDownActive: (active: boolean) => void;
  label: string;
  buttonContent: string;
}

const ProjectCreateInput = ({
  elementId,
  inputValue,
  onInputValueChange,
  targetStepIsCurrentStep,
  onNextButtonClick,
  changeWheelDownActive,
  label,
  buttonContent,
}: ProjectCreateInputProps) => {
  const [valid, setValid] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetStepIsProjectName = elementId === PROJECT_NAME_INPUT_ID;
  const HEIGHT = targetStepIsProjectName ? 100 : 90;
  const MB = targetStepIsProjectName ? 30 : 20;

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    onInputValueChange(value);

    if (value && value.length <= MAX_INPUT_LENGTH) {
      setValid(true);
      changeWheelDownActive(true);
      return;
    }

    if (!value) {
      setValid(null);
      changeWheelDownActive(false);
      return;
    }

    setValid(false);
    changeWheelDownActive(false);
  };

  const handleEnterDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && valid) {
      onNextButtonClick();
    }
  };

  useEffect(() => {
    if (!targetStepIsCurrentStep) {
      inputRef.current?.blur();
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  }, [targetStepIsCurrentStep]);

  return (
    <div
      className={`w-[100%] flex flex-col justify-end gap-[4.375rem] h-[${HEIGHT}%]`}
    >
      <div
        className={`transition-all ease-in-out duration-1000`}
        style={{ marginBottom: targetStepIsCurrentStep ? `${MB}%` : "-15%" }}
      >
        <label
          className="text-3xl font-semibold text-dark-gray"
          htmlFor={elementId}
        >
          {label}
        </label>
        <br />
        <div
          className={`${
            targetStepIsProjectName ? "flex" : "w-[525px] flex flex-col"
          }`}
        >
          <div className="inline">
            <input
              type="text"
              name={elementId}
              id={elementId}
              value={inputValue}
              ref={inputRef}
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
          <p className="self-end mt-3 ml-[2px] text-3xl font-semibold w-fit text-dark-gray">
            입니다
          </p>
        </div>
      </div>
      <div
        className={`self-end ${
          valid && targetStepIsCurrentStep ? "visible" : "invisible"
        }`}
      >
        <NextStepButton {...{ onNextButtonClick }}>
          {buttonContent}
        </NextStepButton>
      </div>
    </div>
  );
};

export default ProjectCreateInput;
