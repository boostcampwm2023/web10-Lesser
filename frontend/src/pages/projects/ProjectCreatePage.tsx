import { useState } from "react";
import {
  ProjectCreateMainSection,
  ProjectCreateSideBar,
} from "../../components/projects";
import { PROJECT_CREATE_STEP } from "../../constants/projects";
import { Step } from "../../types/common/common";

const ProjectCreatePage = () => {
  const [currentStep, setCurrentStep] = useState<Step>(
    PROJECT_CREATE_STEP.STEP1
  );

  return (
    <div className="flex items-center min-w-[76rem] h-[100vh] mx-6">
      <ProjectCreateSideBar currentStep={currentStep} />
      <ProjectCreateMainSection
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </div>
  );
};

export default ProjectCreatePage;
