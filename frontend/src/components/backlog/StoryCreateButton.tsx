import Plus from "../../assets/icons/plus.svg?react";

interface StoryCreateButtonProps {
  onClick: () => void;
}

const StoryCreateButton = ({ onClick }: StoryCreateButtonProps) => (
  <button
    type="button"
    className="flex items-center justify-center w-full gap-2 py-1 rounded-md bg-middle-green"
    onClick={onClick}
  >
    <Plus width={24} height={24} stroke="white" />
    <span className="text-white">Story 생성하기</span>
  </button>
);

export default StoryCreateButton;
