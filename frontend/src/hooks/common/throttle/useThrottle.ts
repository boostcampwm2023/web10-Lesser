import { useRef } from "react";

const useThrottle = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const throttle = (time: number, callback: () => void) => {
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }, time);

      callback();
    }
  };

  return throttle;
};

export default useThrottle;
