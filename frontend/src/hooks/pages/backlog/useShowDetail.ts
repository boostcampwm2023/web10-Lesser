import { useState } from "react";

const useShowDetail = () => {
  const [showDetail, setShowDetail] = useState(false);

  const handleShowDetail = (showing: boolean) => {
    setShowDetail(showing);
  };

  return { showDetail, handleShowDetail };
};

export default useShowDetail;
