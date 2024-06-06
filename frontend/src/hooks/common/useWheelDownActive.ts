import { useState } from "react";

const useWheelUpDown = () => {
  const [wheelDownActive, setWheelDownActive] = useState(false);

  const changeWheelDownActive = (active: boolean) => {
    setWheelDownActive(active);
  };

  return { wheelDownActive, changeWheelDownActive };
};

export default useWheelUpDown;
