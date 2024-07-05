import { useEffect, useRef, useState } from "react";

const useDropdownState = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOutsideClick = ({ target }: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return { open, dropdownRef, handleOpen, handleClose };
};

export default useDropdownState;
