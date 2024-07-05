import Check from "../../assets/icons/check.svg?react";
import Closed from "../../assets/icons/closed.svg?react";
import CategoryChip from "./CategoryChip";

const StoryCreateForm = () => (
  <div className="flex items-center gap-5 py-1 border-t border-b">
    <div className="w-[5rem]">
      <CategoryChip content="프로젝트" bgColor="green" />
    </div>
    <input className="w-[38.75rem]" type="text" />
    <div className="flex items-center ">
      <input className="w-14" type="number" id="point-number" />
      <label htmlFor="point-number" className="">
        POINT
      </label>
    </div>
    <div className="flex items-center gap-2">
      <button
        className="flex items-center justify-center w-6 h-6 rounded-md bg-confirm-green"
        type="button"
      >
        <Check width={20} height={20} stroke="white" />
      </button>
      <button
        className="flex items-center justify-center w-6 h-6 rounded-md bg-error-red"
        type="button"
      >
        <Closed stroke="white" />
      </button>
    </div>
  </div>
);

export default StoryCreateForm;
