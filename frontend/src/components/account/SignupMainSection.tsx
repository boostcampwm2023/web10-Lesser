import { ChangeEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postSignup } from "../../apis/api/signupAPI";
import NicknameInput from "./NicknameInput";
import PositionInput from "./PositionInput";
import TechStackInput from "./TechStackInput";
import { ROUTER_URL } from "../../constants/path";
import { STORAGE_KEY } from "../../constants/storageKey";
import CreateMainSection from "../common/CreateMainSection";
import { SignupDTO } from "../../types/DTO/authDTO";

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
  const [signupData, setSignupData] = useState<SignupDTO>({
    username: "",
    position: null,
    techStack: null,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const MAX_STEP_NUMBER = 3;

  const handlePrevStepAreaClick = () => {
    if (currentStepNumber > 1) {
      onGoPrevStep();
    }
  };

  const handleUsernameChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = target.value.trim();
    setSignupData({ ...signupData, username: value });
  };

  const handlePositionChange = (position: string) => {
    setSignupData({ ...signupData, position });
  };

  const handleAddTechStack = (techStack: string) => {
    if (!signupData.techStack) {
      setSignupData({ ...signupData, techStack: [techStack] });
      return;
    }

    if (signupData.techStack.indexOf(techStack) < 0) {
      const newTechStack = [...signupData.techStack, techStack];
      setSignupData({ ...signupData, techStack: newTechStack });
      return;
    }
  };

  const handleDeleteTechStack = (techStack: string) => {
    const newTechStack = [...(signupData.techStack as string[])];
    const targetIndex = newTechStack.indexOf(techStack);
    newTechStack.splice(targetIndex, 1);
    setSignupData({ ...signupData, techStack: newTechStack });
  };

  const handleSignupButtonClick = async () => {
    const status = await postSignup({
      ...signupData,
      tempIdToken: location.state.tempIdToken,
    });
    const redirectURL = sessionStorage.getItem(STORAGE_KEY.REDIRECT);

    if (status === 201) {
      redirectURL
        ? navigate(redirectURL, { replace: true })
        : navigate(ROUTER_URL.PROJECTS, { replace: true });
    }
  };

  const handleGoNextStep = () => {
    if (currentStepNumber < MAX_STEP_NUMBER) {
      onGoNextStep();
    }
  };

  return (
    <CreateMainSection
      currentStepNumber={currentStepNumber}
      onPrevStepAreaClick={handlePrevStepAreaClick}
    >
      <NicknameInput
        {...{
          currentStepNumber,
        }}
        username={signupData.username}
        onUsernameChange={handleUsernameChange}
        onGoNextStep={handleGoNextStep}
      />
      <PositionInput
        {...{
          currentStepNumber,
        }}
        onPositionChange={handlePositionChange}
        onGoNextStep={handleGoNextStep}
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
