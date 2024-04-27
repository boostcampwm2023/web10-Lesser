import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postSignup } from "../../apis/api/signupAPI";
import NicknameInput from "./NicknameInput";
import PositionInput from "./PositionInput";
import TechStackInput from "./TechStackInput";
import { SIGNUP_STEP } from "../../constants/account";
import { ROUTER_URL } from "../../constants/path";
import { STORAGE_KEY } from "../../constants/storageKey";

interface SignupMainSectionProps {
  currentStepNumber: number;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<{ NUMBER: number; NAME: string }>
  >;
}

const SignupMainSection = ({
  currentStepNumber,
  setCurrentStep,
}: SignupMainSectionProps) => {
  const nicknameRef = useRef<string>("");
  const positionRef = useRef<null | string>(null);
  const techRef = useRef<null | string[]>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handlePrevStepAreaClick = () => {
    setCurrentStep((prevStep) => {
      if (prevStep.NUMBER === SIGNUP_STEP.STEP3.NUMBER) {
        return SIGNUP_STEP.STEP2;
      }

      if (prevStep.NUMBER === SIGNUP_STEP.STEP2.NUMBER) {
        return SIGNUP_STEP.STEP1;
      }

      return prevStep;
    });
  };

  const handleSignupButtonClick = async () => {
    const status = await postSignup({
      username: nicknameRef.current,
      position: positionRef.current,
      techStack: techRef.current,
      tempIdToken: location.state.tempIdToken,
    });
    const redirectURL = sessionStorage.getItem(STORAGE_KEY.REDIRECT);

    if (status === 201) {
      redirectURL
        ? navigate(redirectURL, { replace: true })
        : navigate(ROUTER_URL.PROJECTS, { replace: true });
    }
  };

  useEffect(() => {
    const nicknameInput = document.getElementById("nickname");
    const nicknameInputElement = document.getElementById("nickname-input-box");
    const techStackInput = document.getElementById("tech");

    switch (currentStepNumber) {
      case SIGNUP_STEP.STEP1.NUMBER:
        nicknameInput?.scrollIntoView({ behavior: "smooth", block: "center" });
        break;

      case SIGNUP_STEP.STEP2.NUMBER:
        nicknameInputElement?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      case SIGNUP_STEP.STEP3.NUMBER:
        techStackInput?.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
    }
  }, [currentStepNumber]);

  return (
    <main className="relative ml-10 pl-7 min-w-[720] h-[40.5rem]">
      <div
        className={`absolute top-0 bg-gradient-to-b from-white to-90% min-w-[90%] min-h-[9.25rem] z-10 ${
          currentStepNumber > 1 && "hover:cursor-pointer hover:to-0%"
        }`}
        onClick={handlePrevStepAreaClick}
      ></div>
      <section className="h-[100%] overflow-y-hidden">
        <NicknameInput
          {...{ currentStepNumber, setCurrentStep, nicknameRef }}
        />
        <PositionInput
          {...{ currentStepNumber, setCurrentStep, positionRef }}
        />
        <TechStackInput
          {...{ setCurrentStep, techRef }}
          onSignupButtonClick={handleSignupButtonClick}
        />
      </section>
    </main>
  );
};

export default SignupMainSection;
