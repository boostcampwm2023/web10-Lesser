import { useRef, useState } from "react";
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

  const handleSignupButtonClick = () => {};

  return (
    <div className="flex items-center min-w-[76rem] h-[100vh] mx-6">
      <SignupSideBar
        currentStepName={currentStep.NAME}
        currentStepNumber={currentStep.NUMBER}
      />
      <div className="relative ml-10 pl-7 w-[100%] h-[40.5rem] overflow-y-scroll">
        <div className="absolute top-0 bg-gradient-to-b from-white-transparent to-90% min-h-[9.25rem]"></div>
        <NicknameInput {...{ setCurrentStep, nicknameRef }} />
        <JobInput {...{ setCurrentStep, jobRef }} />
        <TechStackInput
          {...{ techRef }}
          onSignupButtonClick={handleSignupButtonClick}
        />
      </div>
    </div>
  );
};

export default SignupPage;
