import { Step } from "../../types/common";

interface ProjectCreateSideBarProps {
  currentStep: Step;
}

const ProjectCreateSideBar = ({ currentStep }: ProjectCreateSideBarProps) => (
  <div className="w-[24.75rem] h-[40.5rem] bg-gradient-to-bl from-white-transparent to-70% bg-middle-green px-12 shadow-box">
    <h2 className="mt-40 text-4xl font-black text-white">
      프로젝트
      <br />
      생성하기
    </h2>
    <p className="mt-10 text-lg text-white opacity-80">
      여러분이 관리하실
      <br />
      프로젝트를
      <br />
      생성해보세요
    </p>
    <div className="text-white w-[18.5rem] h-[6.75rem] p-5 text-lg rounded-2xl mt-32 bg-white bg-opacity-20">
      <p className="opacity-80">회원 가입 {currentStep.NUMBER}단계</p>
      <p className="mt-2 font-bold">{currentStep.NAME}</p>
    </div>
  </div>
);

export default ProjectCreateSideBar;
