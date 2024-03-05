import { ChangeEvent, useState } from "react";
import { SIGNUP_STEP } from "../../constants/account";
import NextStepButton from "./NextStepButton";

interface NicknameInputProps {
  currentStep: { NUMBER: number; NAME: string };
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
  nicknameRef: React.MutableRefObject<string>;
}

const NicknameInput = ({
  currentStep,
  setCurrentStep,
  nicknameRef,
}: NicknameInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [validated] = useState<boolean | null>(null);

  const handleNextButtonClick = () => {
    setCurrentStep(SIGNUP_STEP.STEP2);
  };

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setInputValue(target.value);
    nicknameRef.current = target.value;
  };

  return (
    <div
      className={`flex h-[100%] ${
        currentStep === SIGNUP_STEP.STEP1 ? "items-center" : "items-end"
      }`}
    >
      <div className="w-[80%]">
        <label
          className="text-3xl font-semibold text-dark-gray"
          htmlFor="nickname"
        >
          LESSER에서 사용할 제 이름은
        </label>
        <br />
        <div id="nickname-input-box" className="flex">
          <div className="inline">
            <input
              type="text"
              name="nickname"
              id="nickname"
              value={inputValue}
              onChange={(e) => handleInputChange(e)}
              className={`w-[27.5rem] h-[3rem] border-b-2 focus:outline-none focus:border-b-3 focus:border-middle-green  font-semibold text-3xl ${
                inputValue && "border-b-3 border-middle-green "
              } ${
                validated !== null &&
                !validated &&
                "border-b-3 border-error-text focus:border-error-text"
              }`}
            />
            {validated !== null && !validated && (
              <p className="text-error-text">이미 사용 중인 닉네임입니다</p>
            )}
          </div>
          <span className="text-3xl font-semibold text-dark-gray">입니다</span>
        </div>
      </div>
      {currentStep === SIGNUP_STEP.STEP1 && (
        <NextStepButton onNextButtonClick={handleNextButtonClick}>
          Next
        </NextStepButton>
      )}
    </div>
  );
};

export default NicknameInput;
