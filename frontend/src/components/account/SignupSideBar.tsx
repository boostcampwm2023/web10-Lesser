interface SignupSideBarProps {
  currentStepNumber: number;
  currentStepName: string;
}

const SignupSideBar = ({
  currentStepNumber,
  currentStepName,
}: SignupSideBarProps) => (
  <div className="w-[24.75rem] h-[40.5rem] bg-gradient-to-bl from-white-transparent to-70% bg-light-green px-12 shadow-box">
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
      <p className="opacity-80">회원 가입 {currentStepNumber}단계</p>
      <p className="mt-2 font-bold">{currentStepName}</p>
    </div>
  </div>
);

export default SignupSideBar;
