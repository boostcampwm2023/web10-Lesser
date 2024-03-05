import { useEffect, useRef, useState } from "react";
import JobInput from "../../components/account/JobInput";
import NicknameInput from "../../components/account/NicknameInput";
import TechStackInput from "../../components/account/TechStackInput";
import SignupSideBar from "../../components/account/SignupSideBar";
import { SIGNUP_STEP } from "../../constants/account";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState<{
    NUMBER: number;
    NAME: string;
  }>(SIGNUP_STEP.STEP1);
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
    switch (currentStep.NUMBER) {
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
  }, [currentStep]);

  return (
    <div className="flex items-center min-w-[76rem] h-[100vh] mx-6">
      <SignupSideBar
        currentStepName={currentStep.NAME}
        currentStepNumber={currentStep.NUMBER}
      />
      <div className="relative ml-10 pl-7 w-[100%] h-[40.5rem]">
        <div
          className={`absolute top-0 bg-gradient-to-b from-white to-90% min-w-[90%] min-h-[9.25rem] z-10 ${
            currentStep.NUMBER > 1 && "hover:cursor-pointer"
          }`}
          onClick={handlePrevStepAreaClick}
        ></div>
        <section className="h-[100%] overflow-y-hidden">
          <NicknameInput {...{ currentStep, setCurrentStep, nicknameRef }} />
          <JobInput {...{ currentStep, setCurrentStep, jobRef }} />
          <TechStackInput
            {...{ currentStep, setCurrentStep, techRef }}
            onSignupButtonClick={handleSignupButtonClick}
          />
        </section>
      </div>
    </div>
  );
};

export default SignupPage;
