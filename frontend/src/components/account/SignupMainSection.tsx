import { WheelEvent, useState } from "react";
import UsernameInput from "./UsernameInput";
import PositionInput from "./PositionInput";
import TechStackInput from "./TechStackInput";
import CreateMainSection from "../common/CreateMainSection";
import { MAX_STEP_NUMBER } from "../../constants/account";
import useDebounce from "../../hooks/common/useDebounce";
import useSignupForm from "../../hooks/pages/account/useSignupForm";

interface SignupMainSectionProps {
  currentStepNumber: number;
  onGoNextStep: () => void;
  onGoPrevStep: () => void;
}

const SignupMainSection = ({
  currentStepNumber,
  onGoNextStep,
  onGoPrevStep,
}: SignupMainSectionProps) => {
  const {
    signupData,
    handleUsernameChange,
    handlePositionChange,
    handleAddTechStack,
    handleDeleteTechStack,
    handleSignupButtonClick,
  } = useSignupForm();
  const [wheelDownActive, setWheelDownActive] = useState(false);
  const debounce = useDebounce();

  const handleGoPrevStep = () => {
    if (currentStepNumber > 1) {
      setWheelDownActive(true);
      onGoPrevStep();
    }
  };

  const handleGoNextStep = () => {
    if (currentStepNumber < MAX_STEP_NUMBER) {
      onGoNextStep();
    }
  };

  const handleWheelUpDown = (event: WheelEvent) => {
    const direction: "UP" | "DOWN" = event.deltaY > 0 ? "DOWN" : "UP";

    debounce(100, () => {
      if (direction === "UP") {
        handleGoPrevStep();
        return;
      }

      if (wheelDownActive) {
        handleGoNextStep();
      }
    });
  };

  const wheelDownActiveChange = (active: boolean) => {
    setWheelDownActive(active);
  };

  return (
    <CreateMainSection
      {...{ currentStepNumber, wheelDownActive }}
      onGoPrevStep={handleGoPrevStep}
      onWheelUpDown={handleWheelUpDown}
    >
      <UsernameInput
        {...{
          currentStepNumber,
        }}
        username={signupData.username}
        onUsernameChange={handleUsernameChange}
        onGoNextStep={handleGoNextStep}
        wheelDownActiveChange={wheelDownActiveChange}
      />
      <PositionInput
        {...{
          currentStepNumber,
        }}
        onPositionChange={handlePositionChange}
        onGoNextStep={handleGoNextStep}
        wheelDownActiveChange={wheelDownActiveChange}
      />
      <TechStackInput
        {...{
          currentStepNumber,
        }}
        techStack={signupData.techStack}
        onAddTechStack={handleAddTechStack}
        onDeleteTechStack={handleDeleteTechStack}
        onSignupButtonClick={handleSignupButtonClick}
      />
    </CreateMainSection>
  );
};

export default SignupMainSection;
