import { useState } from "react";
import SignupSideBar from "../../components/account/SignupSideBar";
import SignupMainSection from "../../components/account/SignupMainSection";
import { SIGNUP_STEP } from "../../constants/account";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState<{
    NUMBER: number;
    NAME: string;
  }>(SIGNUP_STEP.STEP1);

  return (
    <div className="flex items-center min-w-[76rem] h-[100vh] mx-6">
      <SignupSideBar
        currentStepName={currentStep.NAME}
        currentStepNumber={currentStep.NUMBER}
      />
      <SignupMainSection
        currentStepNumber={currentStep.NUMBER}
        setCurrentStep={setCurrentStep}
      />
    </div>
  );
};

export default SignupPage;
