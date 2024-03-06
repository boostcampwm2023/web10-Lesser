import { useEffect, useRef } from "react";
import NicknameInput from "./NicknameInput";
import PositionInput from "./PositionInput";
import TechStackInput from "./TechStackInput";
import { SIGNUP_STEP } from "../../constants/account";

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
  const jobRef = useRef<string | null>(null);
  const techRef = useRef<string[]>([]);

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

  const handleSignupButtonClick = () => {};

  useEffect(() => {
    switch (currentStepNumber) {
      case SIGNUP_STEP.STEP1.NUMBER:
        const nicknameInput = document.getElementById("nickname");
        nicknameInput?.scrollIntoView({ block: "center", behavior: "smooth" });
        break;

      case SIGNUP_STEP.STEP2.NUMBER:
        const nicknameInputElement =
          document.getElementById("nickname-input-box");
        nicknameInputElement?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      case SIGNUP_STEP.STEP3.NUMBER:
        const jobInputElement = document.getElementById("job-input-box");
        jobInputElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
    }
  }, [currentStepNumber]);

  return (
    <main className="relative ml-10 pl-7 w-[100%] h-[40.5rem]">
      <div
        className={`absolute top-0 bg-gradient-to-b from-white to-90% min-w-[90%] min-h-[9.25rem] z-10 ${
          currentStepNumber > 1 && "hover:cursor-pointer"
        }`}
        onClick={handlePrevStepAreaClick}
      ></div>
      <section className="h-[100%] overflow-y-hidden">
        <NicknameInput
          {...{ currentStepNumber, setCurrentStep, nicknameRef }}
        />
        <PositionInput {...{ currentStepNumber, setCurrentStep, jobRef }} />
        <TechStackInput
          {...{ setCurrentStep, techRef }}
          onSignupButtonClick={handleSignupButtonClick}
        />
      </section>
    </main>
  );
};

export default SignupMainSection;
