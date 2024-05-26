import { useState } from "react";
import { SignupDTO } from "../../../types/DTO/authDTO";
import { postSignup } from "../../../apis/api/signupAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { STORAGE_KEY } from "../../../constants/storageKey";
import { ROUTER_URL } from "../../../constants/path";

const useSignupForm = () => {
  const [signupData, setSignupData] = useState<SignupDTO>({
    username: "",
    position: null,
    techStack: null,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleUsernameChange = (username: string) => {
    setSignupData({ ...signupData, username });
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

  return {
    signupData,
    handleUsernameChange,
    handlePositionChange,
    handleAddTechStack,
    handleDeleteTechStack,
    handleSignupButtonClick,
  };
};

export default useSignupForm;
