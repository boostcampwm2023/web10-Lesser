import { useEffect } from "react";
import useDebounce from "../../common/useDebounce";

interface Params {
  currentStepNumber: number;
  targetStepNumber: number;
  dependency?: unknown;
  goToNextStep: () => void;
}

const useWheelDown = ({
  currentStepNumber,
  targetStepNumber,
  dependency,
  goToNextStep,
}: Params) => {
  const debounce = useDebounce();
  useEffect(() => {
    const handleWheelEvent = (event: WheelEvent) => {
      if (currentStepNumber !== targetStepNumber) {
        return;
      }

      debounce(100, () => {
        const downScrolled = event.deltaY > 0;

        if (downScrolled && dependency) {
          goToNextStep();
        }
      });
    };

    window.addEventListener("wheel", handleWheelEvent);

    return () => {
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, [dependency, currentStepNumber]);
};

export default useWheelDown;
