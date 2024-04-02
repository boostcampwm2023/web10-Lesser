import { useEffect, useRef } from "react";
import ProjectCreateInput from "./ProjectCreateInput";
import {
  PROJECT_CREATE_STEP,
  PROJECT_NAME_INPUT_ID,
  PROJECT_SUBJECT_INPUT_ID,
} from "../../constants/projects";
import { Step } from "../../types/common";

interface ProjectCreateMainSectionProps {
  currentStep: Step;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
}

const ProjectCreateMainSection = ({
  currentStep,
  setCurrentStep,
}: ProjectCreateMainSectionProps) => {
  const projectNameRef = useRef<string>("");
  const projectSubjectRef = useRef<string>("");

  const handlePrevStepAreaClick = () => {
    setCurrentStep((prevStep) => {
      if (prevStep.NUMBER === PROJECT_CREATE_STEP.STEP2.NUMBER) {
        return PROJECT_CREATE_STEP.STEP1;
      }

      return prevStep;
    });
  };

  const handleCreateButtonClick = async () => {};

  const handleNextButtonClick = () => {
    setCurrentStep(PROJECT_CREATE_STEP.STEP2);
  };

  useEffect(() => {
    const nicknameInput = document.getElementById(PROJECT_NAME_INPUT_ID);
    const nicknameInputElement = document.getElementById(
      `${PROJECT_NAME_INPUT_ID}-input-box`
    );

    switch (currentStep.NUMBER) {
      case PROJECT_CREATE_STEP.STEP1.NUMBER:
        nicknameInput?.scrollIntoView({ behavior: "smooth", block: "center" });
        break;

      case PROJECT_CREATE_STEP.STEP2.NUMBER:
        nicknameInputElement?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
    }
  }, [currentStep.NUMBER]);

  return (
    <main className="relative ml-10 pl-7 w-[100%] h-[40.5rem]">
      <div
        className={`absolute top-0 bg-gradient-to-b from-white to-90% min-w-[90%] min-h-[9.25rem] z-10 ${
          currentStep.NUMBER > 1 && "hover:cursor-pointer hover:to-0%"
        }`}
        onClick={handlePrevStepAreaClick}
      ></div>
      <section className="h-[100%] overflow-y-hidden">
        <ProjectCreateInput
          inputRef={projectNameRef}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          targetStep={PROJECT_CREATE_STEP.STEP1}
          onNextButtonClick={handleNextButtonClick}
          elementId={PROJECT_NAME_INPUT_ID}
          label="우리가 수행할 프로젝트의 이름은"
          buttonContent="Next"
          containerHeight={100}
        />
        <ProjectCreateInput
          inputRef={projectSubjectRef}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          targetStep={PROJECT_CREATE_STEP.STEP2}
          onNextButtonClick={handleCreateButtonClick}
          elementId={PROJECT_SUBJECT_INPUT_ID}
          label="우리가 수행할 프로젝트의 주제는"
          buttonContent="생성하기"
          containerHeight={90}
        />
      </section>
    </main>
  );
};

export default ProjectCreateMainSection;
