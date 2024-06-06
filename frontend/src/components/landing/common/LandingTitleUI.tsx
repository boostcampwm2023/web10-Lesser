import React from "react";
import Plus from "../../../assets/icons/plus.svg?react";

interface LandingTitleUIProps {
  handleClick: () => void;
  title: string;
}

const LandingTitleUI = ({ handleClick, title }: LandingTitleUIProps) => {
  return (
    <div className="flex justify-between items-center pr-3">
      <p className="text-white text-m font-bold">| {title}</p>
      <button onClick={handleClick} className="hover:bg-dark-green rounded-md">
        <Plus width={24} height={24} stroke="#FFFFFF " />
      </button>
    </div>
  );
};

export default React.memo(LandingTitleUI);
