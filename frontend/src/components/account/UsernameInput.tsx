import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import NextStepButton from "../common/NextStepButton";
import {
  getGithubUsername,
  getNicknameAvailability,
} from "../../apis/api/signupAPI";
import useDebounce from "../../hooks/common/useDebounce";
import { SIGNUP_STEP_NUMBER } from "../../constants/account";

interface NicknameInputProps {
  currentStepNumber: number;
  username: string;
  onUsernameChange: (username: string) => void;
  onGoNextStep: () => void;
  wheelDownActiveChange: (active: boolean) => void;
}

const UsernameInput = ({
  currentStepNumber,
  username,
  onUsernameChange,
  onGoNextStep,
  wheelDownActiveChange,
}: NicknameInputProps) => {
  const [validated, setValidated] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounce = useDebounce();
  const location = useLocation();

  const goToNextStep = () => {
    inputRef.current?.blur();
    wheelDownActiveChange(false);
    onGoNextStep();
  };

  const handleUsernameChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    wheelDownActiveChange(false);
    const value = target.value.trim();
    onUsernameChange(value);
  };

  const nicknameAvailabilityCheck = async () => {
    if (!username) {
      return;
    }

    const available = await getNicknameAvailability(username);
    if (available) {
      setValidated(true);
      wheelDownActiveChange(true);
    } else {
      setValidated(false);
    }
  };

  const handleEnterDown = ({ key }: React.KeyboardEvent) => {
    if (key === "Enter" && validated) {
      onGoNextStep();
    }
  };

  useEffect(() => {
    const getUsername = async () => {
      const githubUsername = await getGithubUsername(
        location.state.tempIdToken
      );

      onUsernameChange(githubUsername);
    };

    getUsername();
  }, []);

  useEffect(() => {
    setValidated(null);
    debounce(1000, nicknameAvailabilityCheck);
  }, [username]);

  return (
    <div
      className={`w-[100%] flex flex-col justify-end gap-[4.375rem] h-[100%] `}
    >
      <div
        className={` transition-all ease-in-out duration-1000 ${
          currentStepNumber === SIGNUP_STEP_NUMBER.STEP1
            ? "mb-[30%]"
            : "mb-[-15%]"
        }`}
      >
        <label
          className="text-3xl font-semibold text-dark-gray"
          htmlFor="nickname"
        >
          LESSER에서 사용할 제 이름은
        </label>
        <br />
        <div className="flex w-[525px]">
          <div className="inline">
            <input
              type="text"
              name="nickname"
              id="nickname"
              value={username}
              ref={inputRef}
              autoComplete="off"
              onChange={handleUsernameChange}
              onKeyDown={handleEnterDown}
              className={`w-[27.5rem] h-[3rem] border-b-2 focus:outline-none focus:border-b-3 font-semibold text-3xl ${
                username && validated && "border-b-3 border-middle-green "
              } 
              ${
                validated !== null && !validated
                  ? "border-b-3 border-error-red focus:border-error-red"
                  : "focus:border-middle-green"
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
      <div
        className={`self-end ${
          validated && currentStepNumber === SIGNUP_STEP_NUMBER.STEP1
            ? "visible"
            : "invisible"
        }`}
      >
        <NextStepButton onNextButtonClick={goToNextStep}>Next</NextStepButton>
      </div>
    </div>
  );
};

export default UsernameInput;
