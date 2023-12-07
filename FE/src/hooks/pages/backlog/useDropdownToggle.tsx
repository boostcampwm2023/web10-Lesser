import { useRef, useState } from 'react';

const useDropdownToggle = () => {
  const [detail, setDetail] = useState<Boolean>(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = ({ target }: MouseEvent) => {
    if (detailRef.current && !detailRef.current.contains(target as Node)) {
      setDetail(false);
    }
  };

  const toggleDetail = () => {
    setDetail((detail) => !detail);
  };

  return { detail, toggleDetail, detailRef, handleOutsideClick };
};

export default useDropdownToggle;
