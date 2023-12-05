import { useState } from 'react';

const useDetail = () => {
  const [detail, setDetail] = useState<Boolean>(true);

  const toggleDetail = () => {
    setDetail((detail) => !detail);
  };

  return { detail, toggleDetail };
};

export default useDetail;
