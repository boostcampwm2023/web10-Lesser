import { useRef, useState } from "react";
import JobInput from "../../components/account/JobInput";
import NicknameInput from "../../components/account/NicknameInput";
import TechStackInput from "../../components/account/TechStackInput";
import { SIGNUP_STEP } from "../../constants/account";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState<{
    NUMBER: number;
    NAME: string;
  }>(SIGNUP_STEP.STEP1);
  const nicknameRef = useRef<string>("");
  const jobRef = useRef<string | null>(null);
  const techRef = useRef<string[]>([]);

  return (
    <div className="flex items-center min-w-[76rem] h-[100vh] mx-6">
      <div className="w-[24.75rem] h-[40.5rem] bg-gradient-to-bl from-white-transparent to-70% bg-light-green px-12">
        <h2 className="mt-40 text-4xl font-black text-white">
          Lesser
          <br />
          회원 가입
        </h2>
        <p className="mt-10 text-lg text-white opacity-80">
          여러분의 정보를 입력하여 가입한 후<br />
          제품 백로그 관리, 스프린트 관리 등<br />
          여러 기능을 경험해보세요
        </p>
        <div className="text-white w-[18.5rem] h-[6.75rem] p-5 text-lg rounded-2xl mt-32 bg-white bg-opacity-20">
          <p className="opacity-80">회원 가입 {currentStep.NUMBER}단계</p>
          <p className="mt-2 font-bold">{currentStep.NAME}</p>
        </div>
      </div>
      <div className="relative ml-10 pl-7 w-[100%] h-[40.5rem] overflow-y-scroll">
        <div className="absolute top-0 bg-gradient-to-b from-white-transparent to-90% min-h-[9.25rem]"></div>
        <NicknameInput {...{ setCurrentStep, nicknameRef }} />
        <JobInput {...{ setCurrentStep, jobRef }} />
        <TechStackInput {...{ techRef }} />
      </div>
    </div>
  );
};

export default SignupPage;
