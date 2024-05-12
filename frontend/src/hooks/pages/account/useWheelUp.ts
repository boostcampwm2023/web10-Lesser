import { useEffect } from "react";
import useDebounce from "../../common/useDebounce";

interface Params {
  currentStepNumber: number;
  targetStepNumber: number;
  goToPrevStep: () => void;
}

const useWheelUp = ({
  currentStepNumber,
  targetStepNumber,
  goToPrevStep,
}: Params) => {
  const debounce = useDebounce();
  useEffect(() => {
    const handleWheelEvent = (event: WheelEvent) => {
      if (currentStepNumber !== targetStepNumber) {
        return;
      }

      debounce(100, () => {
        const upScrolled = event.deltaY < 0;

        if (upScrolled) {
          goToPrevStep();
        }
      });
    };

    window.addEventListener("wheel", handleWheelEvent);

    return () => {
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, [currentStepNumber]);
};

export default useWheelUp;
