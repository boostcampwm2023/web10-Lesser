import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    addEventListener('mousedown', handleOutsideClick);

    return () => {
      removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return { detail, toggleDetail, detailRef };
};

export default useDropdownToggle;
