import { useEffect } from "react";
import useDebounce from "../../common/useDebounce";

interface Params {
  currentStepNumber: number;
  targetStepNumber: number;
  dependency?: unknown;
  goToPrevStep: () => void;
}

const useWheelUp = ({
  currentStepNumber,
  targetStepNumber,
  dependency,
  goToPrevStep,
}: Params) => {
  const debounce = useDebounce();
  useEffect(() => {
    const handleWheelEvent = (event: WheelEvent) => {
      if (currentStepNumber !== targetStepNumber) {
        return;
      }

      debounce(100, () => {
        const upScrolled = event.deltaY > 0;

        if (upScrolled && dependency) {
          goToPrevStep();
        }
      });
    };

    window.addEventListener("wheel", handleWheelEvent);

    return () => {
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, [dependency, currentStepNumber]);
};

export default useWheelUp;
