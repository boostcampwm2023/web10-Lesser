import { useEffect, useRef, useState } from "react";

const useBacklogInputChange = (update: <T>(data: T) => void) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const inputElementRef = useRef<HTMLInputElement | null>(null);

  const handleUpdating = (updating: boolean) => {
    setUpdating(updating);
  };

  const handleOutsideClick = ({ target }: MouseEvent) => {
    if (
      inputContainerRef.current &&
      !inputContainerRef.current.contains(target as Node)
    ) {
      if (!updating) {
        return;
      }

      if (inputElementRef.current) {
        update(inputElementRef.current.value);
      }

      setUpdating(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleOutsideClick);

    return () => {
      window.removeEventListener("mouseup", handleOutsideClick);
    };
  }, [updating]);

  return { updating, inputContainerRef, inputElementRef, handleUpdating };
};

export default useBacklogInputChange;
