import { ChangeEvent, useEffect, useState } from "react";
import { SIGNUP_STEP } from "../../constants/account";
import NextStepButton from "./NextStepButton";
import useDebounce from "../../hooks/common/useDebounce";
import {
  getGithubUsername,
  getNicknameAvailability,
} from "../../apis/api/signupAPI";
import { useLocation } from "react-router-dom";

interface NicknameInputProps {
  currentStepNumber: number;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
  nicknameRef: React.MutableRefObject<string>;
}

const NicknameInput = ({
  currentStepNumber,
  setCurrentStep,
  nicknameRef,
}: NicknameInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [validated, setValidated] = useState<boolean | null>(null);
  const location = useLocation();
  const debounce = useDebounce();

  const handleNextButtonClick = () => {
    setCurrentStep(SIGNUP_STEP.STEP2);
  };

  const nicknameAvailabilityCheck = async () => {
    const available = await getNicknameAvailability(inputValue);
    if (available) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  };

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = target.value.trim();
    setInputValue(value);
    nicknameRef.current = value;
  };

  useEffect(() => {
    if (!inputValue) {
      setValidated(null);
      return;
    }

    debounce(1000, nicknameAvailabilityCheck);
  }, [inputValue]);

  useEffect(() => {
    const getUsername = async () => {
      const githubUsername = await getGithubUsername(
        location.state.tempIdToken
      );
      setInputValue(githubUsername);
      nicknameRef.current = githubUsername;
    };

    getUsername();
  }, []);

  return (
    <div
      className={`flex h-[100%] ${
        currentStepNumber === SIGNUP_STEP.STEP1.NUMBER
          ? "items-center"
          : "items-end"
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
                inputValue && validated && "border-b-3 border-middle-green "
              } ${
                validated !== null &&
                !validated &&
                "border-b-3 border-error-red focus:border-error-red"
              }`}
            />
            {validated !== null && !validated && (
              <p className="font-bold text-error-red text-xxs">
                이미 사용 중인 닉네임입니다
              </p>
            )}
          </div>
          <span className="text-3xl font-semibold text-dark-gray">입니다</span>
        </div>
      </div>
      {validated && (
        <NextStepButton onNextButtonClick={handleNextButtonClick}>
          Next
        </NextStepButton>
      )}
    </div>
  );
};

export default NicknameInput;
