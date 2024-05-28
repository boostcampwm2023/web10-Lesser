import { WheelEvent } from "react";
import UsernameInput from "./UsernameInput";
import PositionInput from "./PositionInput";
import TechStackInput from "./TechStackInput";
import CreateMainSection from "../common/CreateMainSection";
import { MAX_STEP_NUMBER } from "../../constants/account";
import useDebounce from "../../hooks/common/useDebounce";
import useSignupForm from "../../hooks/pages/account/useSignupForm";
import useWheelDownActive from "../../hooks/common/useWheelDownActive";

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
    signupData: { username, techStack },
    handleUsernameChange,
    handlePositionChange,
    handleAddTechStack,
    handleDeleteTechStack,
    handleSignupButtonClick,
  } = useSignupForm();
  const { wheelDownActive, changeWheelDownActive } = useWheelDownActive();
  const debounce = useDebounce();

  const handleGoPrevStep = () => {
    if (currentStepNumber > 1) {
      changeWheelDownActive(true);
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

  return (
    <CreateMainSection
      {...{ currentStepNumber, wheelDownActive }}
      onGoPrevStep={handleGoPrevStep}
      onWheelUpDown={handleWheelUpDown}
    >
      <UsernameInput
        {...{ username, currentStepNumber, changeWheelDownActive }}
        onUsernameChange={handleUsernameChange}
        onGoNextStep={handleGoNextStep}
      />
      <PositionInput
        {...{ currentStepNumber, changeWheelDownActive }}
        onPositionChange={handlePositionChange}
        onGoNextStep={handleGoNextStep}
      />
      <TechStackInput
        {...{ currentStepNumber, techStack }}
        onAddTechStack={handleAddTechStack}
        onDeleteTechStack={handleDeleteTechStack}
        onSignupButtonClick={handleSignupButtonClick}
      />
    </CreateMainSection>
  );
};

export default SignupMainSection;
