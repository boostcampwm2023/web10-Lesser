import LESSER_LOGO from "../assets/Logo.svg";
import GITHUB_LOGO from "../assets/github-mark-white.svg";

const VerticalScriptBar = ({ top, left }: { top: number; left: number }) => {
  return (
    <div
      className="absolute w-[2px] h-[45px] bg-[#2A491D4D]"
      style={{
        top: top >= 0 ? `${top}px` : `${655 + top}px`,
        left: left >= 0 ? `${left}px` : `${758 + left}px`,
      }}
    ></div>
  );
};

const HorizonScriptBar = ({ top, left }: { top: number; left: number }) => {
  return (
    <div
      className="absolute w-[45px] h-[2px] bg-[#2A491D4D]"
      style={{
        top: top >= 0 ? `${top}px` : `${700 + top}px`,
        left: left >= 0 ? `${left}px` : `${713 + left}px`,
      }}
    ></div>
  );
};

const LoginPage = () => {
  return (
    <main className="flex justify-center items-center h-[100vh]">
      <section className="flex flex-col relative ps-[102px] shadow-box h-[700px] w-[758px] justify-center">
        <HorizonScriptBar top={50} left={35} />
        <HorizonScriptBar top={-50} left={35} />
        <HorizonScriptBar top={50} left={-35} />
        <HorizonScriptBar top={-50} left={-35} />
        <VerticalScriptBar top={35} left={50} />
        <VerticalScriptBar top={-35} left={50} />
        <VerticalScriptBar top={35} left={-50} />
        <VerticalScriptBar top={-35} left={-50} />
        <img src={LESSER_LOGO} alt="LESSER_LOGO" width="481px" className="mb-[54px]" />
        <div className="flex flex-col text-m font-semibold space-y-4 text-dark-gray gap-6">
          <p>프로젝트를 관리하는 방법</p>
          <p>애자일하게 일하는 방법</p>
          <p>어려울 필요가 있을까요?</p>
          <p>프로젝트 관리를 더욱 쉽고 애자일하게</p>
        </div>
      </section>
      <section className="flex-col ps-[60px] w-[486px] space-y-11">
        <div className="text-black text-xxl font-bold">
          <p>로그인 후</p>
          <p>프로젝트 관리</p>
          <p>시작하기</p>
        </div>
        <div className="flex space-x-[25px] items-center">
          <div className="h-[2px] w-[100px] bg-text-gray rounded"></div>
          <p className="text-xs text-dark-gray font-bold">SNS 로그인</p>
          <div className="h-[2px] w-[100px] bg-text-gray rounded"></div>
        </div>
        <div className="flex justify-evenly items-center w-[350px] h-[80px] bg-text-black rounded-xl">
          <img src={GITHUB_LOGO} alt="GITHUB_LOGO" width="36px" height="auto" />
          <div className="h-9 w-[0.5px] bg-white"></div>
          <p className="font-semibold text-white text-s">Github아이디로 로그인</p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
