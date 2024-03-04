import LESSER_LOGO from "../assets/Logo.svg";
import { GithubLoginButton, TypingAnimeComponent } from "../components/login";
import { LOGIN_LENGTH, VERTICAL_SCRIPT_POS, HORIZON_SCRIPT_POS } from "../constants/login";

const VerticalScriptBar = ({ top, left }: { top: number; left: number }) => {
  return (
    <div
      className="absolute w-[2px] h-[45px] bg-[#2A491D4D]"
      style={{
        top: top >= 0 ? `${top}px` : `${LOGIN_LENGTH.HEIGHT + top - 45}px`,
        left: left >= 0 ? `${left}px` : `${LOGIN_LENGTH.WIDTH + left}px`,
      }}
    ></div>
  );
};

const HorizonScriptBar = ({ top, left }: { top: number; left: number }) => {
  return (
    <div
      className="absolute w-[45px] h-[2px] bg-[#2A491D4D]"
      style={{
        top: top >= 0 ? `${top}px` : `${LOGIN_LENGTH.HEIGHT + top}px`,
        left: left >= 0 ? `${left}px` : `${LOGIN_LENGTH.WIDTH + left - 45}px`,
      }}
    ></div>
  );
};

const LoginPage = () => {
  const { TOP: horizonTop, LEFT: horizonLeft } = HORIZON_SCRIPT_POS;
  const { TOP: verticalTop, LEFT: verticalLeft } = VERTICAL_SCRIPT_POS;
  return (
    <main className="flex justify-center items-center h-[100vh]">
      <section
        className={`flex flex-col relative ps-[102px] shadow-box min-h-[700px] min-w-[758px] justify-center`}
      >
        <HorizonScriptBar top={horizonTop} left={horizonLeft} />
        <HorizonScriptBar top={-1 * horizonTop} left={horizonLeft} />
        <HorizonScriptBar top={horizonTop} left={-1 * horizonLeft} />
        <HorizonScriptBar top={-1 * horizonTop} left={-1 * horizonLeft} />
        <VerticalScriptBar top={verticalTop} left={verticalLeft} />
        <VerticalScriptBar top={-1 * verticalTop} left={verticalLeft} />
        <VerticalScriptBar top={verticalTop} left={-1 * verticalLeft} />
        <VerticalScriptBar top={-1 * verticalTop} left={-1 * verticalLeft} />
        <img src={LESSER_LOGO} alt="LESSER_LOGO" width="481px" className="mb-[54px]" />
        <TypingAnimeComponent />
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
        <GithubLoginButton />
      </section>
    </main>
  );
};

export default LoginPage;
