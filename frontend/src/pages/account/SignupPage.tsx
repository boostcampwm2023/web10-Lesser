import { useState } from "react";
import SignupSideBar from "../../components/account/SignupSideBar";
import SignupMainSection from "../../components/account/SignupMainSection";
import { SIGNUP_STEP } from "../../constants/account";
import { useLocation } from "react-router-dom";
import { ERROR_MESSAGE } from "../../constants/error";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState<{
    NUMBER: number;
    NAME: string;
  }>(SIGNUP_STEP.STEP1);

  const location = useLocation();
  if (location.state ? false : true) {
    throw Error(ERROR_MESSAGE.NOT_PERMITTED);
  }

  return (
    <div className="flex justify-center items-center min-w-[76rem] h-[100vh] mx-6">
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
