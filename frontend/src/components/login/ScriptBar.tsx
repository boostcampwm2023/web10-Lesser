import { HORIZON_SCRIPT_POS, LOGIN_LENGTH, VERTICAL_SCRIPT_POS } from "../../constants/login";

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

const ScriptBar = () => {
  const { TOP: horizonTop, LEFT: horizonLeft } = HORIZON_SCRIPT_POS;
  const { TOP: verticalTop, LEFT: verticalLeft } = VERTICAL_SCRIPT_POS;
  return (
    <>
      <HorizonScriptBar top={horizonTop} left={horizonLeft} />
      <HorizonScriptBar top={-1 * horizonTop} left={horizonLeft} />
      <HorizonScriptBar top={horizonTop} left={-1 * horizonLeft} />
      <HorizonScriptBar top={-1 * horizonTop} left={-1 * horizonLeft} />
      <VerticalScriptBar top={verticalTop} left={verticalLeft} />
      <VerticalScriptBar top={-1 * verticalTop} left={verticalLeft} />
      <VerticalScriptBar top={verticalTop} left={-1 * verticalLeft} />
      <VerticalScriptBar top={-1 * verticalTop} left={-1 * verticalLeft} />
    </>
  );
};

export default ScriptBar;
