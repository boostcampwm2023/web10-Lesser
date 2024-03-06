// import { ScriptBar, TypingAnimeComponent } from ".";
import LESSER_LOGO from "../../assets/Logo.svg";
import ScriptBar from "./ScriptBar";
import TypingAnimeComponent from "./TypingAnimeComponent";

const LoginCardSection = () => {
  return (
    <section
      className={`flex flex-col relative ps-[102px] shadow-box min-h-[700px] min-w-[758px] justify-center`}
    >
      <ScriptBar />
      <img src={LESSER_LOGO} alt="LESSER_LOGO" width="481px" className="mb-[54px]" />
      <TypingAnimeComponent />
    </section>
  );
};

export default LoginCardSection;
