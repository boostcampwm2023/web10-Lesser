import { LANDING_SPRINT_BAR } from "../../constants/landing";

interface LandingSprintBarProps {
  start: string;
  end: string;
  displayNum: number;
  percent: number;
  type: "SPRINT" | "TOTAL" | "PERSONAL";
}

const LandingSprintBar = ({ start, end, displayNum, percent, type }: LandingSprintBarProps) => {
  const { color, text, bgColor, display } = LANDING_SPRINT_BAR[type];
  return (
    <div className={`flex flex-col ${color}`}>
      <p className="text-base font-bold">{text}</p>
      <div className="flex justify-between">
        <p className="text-m font-bold">{display(displayNum)}</p>
        <div className="w-[13.125rem] flex flex-col">
          <div className="flex justify-between text-black text-base font-bold">
            <p>{start}</p>
            <p>{end}</p>
          </div>
          <div className="w-full h-3 flex bg-light-gray rounded-full">
            <div
              className={`${bgColor} rounded-full`}
              style={{ width: percent <= 1 ? 210 * percent : 210 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSprintBar;
