import { useState } from "react";
import SignupSideBar from "../../components/account/SignupSideBar";
import SignupMainSection from "../../components/account/SignupMainSection";
import { SIGNUP_STEP_NUMBER, SIGNUP_STEP_TEXT } from "../../constants/account";
import { useLocation } from "react-router-dom";
import { ERROR_MESSAGE } from "../../constants/error";

const SignupPage = () => {
  const [currentStepNumber, setCurrentStepNumber] = useState(
    SIGNUP_STEP_NUMBER.STEP1
  );

  const handleGoNextStep = () => {
    setCurrentStepNumber((prev) => prev + 1);
  };

  const handleGoPrevStep = () => {
    setCurrentStepNumber((prev) => prev - 1);
  };

  const location = useLocation();
  if (location.state ? false : true) {
    throw Error(ERROR_MESSAGE.NOT_PERMITTED);
  }

  return (
    <div className="flex justify-center items-center min-w-[76rem] h-[100vh] mx-6">
      <SignupSideBar
        currentStepNumber={currentStepNumber}
        currentStepName={SIGNUP_STEP_TEXT[currentStepNumber]}
      />
      <SignupMainSection
        currentStepNumber={currentStepNumber}
        onGoNextStep={handleGoNextStep}
        onGoPrevStep={handleGoPrevStep}
      />
    </div>
  );
};

export default SignupPage;
