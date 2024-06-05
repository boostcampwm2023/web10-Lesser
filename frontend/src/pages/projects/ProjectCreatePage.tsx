import { useState } from "react";
import {
  ProjectCreateMainSection,
  ProjectCreateSideBar,
} from "../../components/projects";
import {
  CREATE_PROJECT_STEP_NUMBER,
  CREATE_PROJECT_STEP_TEXT,
} from "../../constants/projects";

const ProjectCreatePage = () => {
  const [currentStepNumber, setCurrentStepNumber] = useState(
    CREATE_PROJECT_STEP_NUMBER.STEP1
  );

  const handleGoNextStep = () => {
    setCurrentStepNumber((prev) => prev + 1);
  };

  const handleGoPrevStep = () => {
    setCurrentStepNumber((prev) => prev - 1);
  };

  return (
    <div className="flex justify-center items-center min-w-[76rem] h-[100vh] gap-15">
      <ProjectCreateSideBar
        currentStepNumber={currentStepNumber}
        currentStepName={CREATE_PROJECT_STEP_TEXT[currentStepNumber]}
      />
      <ProjectCreateMainSection
        {...{ currentStepNumber }}
        onGoNextStep={handleGoNextStep}
        onGoPrevStep={handleGoPrevStep}
      />
    </div>
  );
};

export default ProjectCreatePage;
