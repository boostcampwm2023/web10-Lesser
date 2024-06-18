import { WheelEvent } from "react";
import ProjectCreateInput from "./ProjectCreateInput";
import {
  CREATE_PROJECT_MAX_STEP_NUMBER,
  CREATE_PROJECT_STEP_NUMBER,
  PROJECT_NAME_INPUT_ID,
  PROJECT_SUBJECT_INPUT_ID,
} from "../../constants/projects";
import CreateMainSection from "../common/CreateMainSection";
import useDebounce from "../../hooks/common/useDebounce";
import useWheelDownActive from "../../hooks/common/useWheelDownActive";
import useCreateProjectForm from "../../hooks/pages/project/useCreateProjectForm";

interface ProjectCreateMainSectionProps {
  currentStepNumber: number;
  onGoNextStep: () => void;
  onGoPrevStep: () => void;
}

const ProjectCreateMainSection = ({
  currentStepNumber,
  onGoNextStep,
  onGoPrevStep,
}: ProjectCreateMainSectionProps) => {
  const {
    projectData,
    handleTitleChange,
    handleSubjectChange,
    handleCreateButtonClick,
  } = useCreateProjectForm();
  const { wheelDownActive, changeWheelDownActive } = useWheelDownActive();
  const debounce = useDebounce();

  const handleGoPrevStep = () => {
    if (currentStepNumber > 1) {
      onGoPrevStep();
    }
  };

  const handleGoNextStep = () => {
    if (currentStepNumber < CREATE_PROJECT_MAX_STEP_NUMBER) {
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
      {...{ currentStepNumber }}
      onGoPrevStep={handleGoPrevStep}
      onWheelUpDown={handleWheelUpDown}
    >
      <ProjectCreateInput
        targetStepIsCurrentStep={
          currentStepNumber === CREATE_PROJECT_STEP_NUMBER.STEP1
        }
        inputValue={projectData.title}
        onInputValueChange={handleTitleChange}
        onNextButtonClick={handleGoNextStep}
        elementId={PROJECT_NAME_INPUT_ID}
        label="우리가 수행할 프로젝트의 이름은"
        buttonContent="Next"
        changeWheelDownActive={changeWheelDownActive}
      />
      <ProjectCreateInput
        targetStepIsCurrentStep={
          currentStepNumber === CREATE_PROJECT_STEP_NUMBER.STEP2
        }
        inputValue={projectData.subject}
        onInputValueChange={handleSubjectChange}
        onNextButtonClick={handleCreateButtonClick}
        elementId={PROJECT_SUBJECT_INPUT_ID}
        label="우리가 수행할 프로젝트의 주제는"
        buttonContent="생성하기"
        changeWheelDownActive={changeWheelDownActive}
      />
    </CreateMainSection>
  );
};

export default ProjectCreateMainSection;
