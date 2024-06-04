import { WheelEvent } from "react";

interface CreateMainSectionProps {
  currentStepNumber: number;
  onGoPrevStep: () => void;
  onWheelUpDown: (event: WheelEvent) => void;
  children: React.ReactNode;
}

const CreateMainSection = ({
  currentStepNumber,
  onGoPrevStep,
  onWheelUpDown,
  children,
}: CreateMainSectionProps) => (
  <main
    onWheel={onWheelUpDown}
    className="relative ml-10 pl-7 min-w-[720px] h-[40.5rem] overflow-hidden"
  >
    <div
      className={`absolute top-0 bg-gradient-to-b from-white to-99% min-w-[100%] min-h-[6rem] z-10 ${
        currentStepNumber > 1 && "hover:cursor-pointer hover:to-0%"
      }`}
      onClick={onGoPrevStep}
    ></div>
    <section
      className={`h-[100%] transition-all ease-in-out duration-1000`}
      style={{ translate: `0 -${(currentStepNumber - 1) * 90}%` }}
    >
      {children}
    </section>
  </main>
);

export default CreateMainSection;
