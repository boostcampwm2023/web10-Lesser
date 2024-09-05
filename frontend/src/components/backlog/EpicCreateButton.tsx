import Plus from "../../assets/icons/plus.svg?react";

interface EpicCreateButtonProps {
  onClick: () => void;
}

const EpicCreateButton = ({ onClick }: EpicCreateButtonProps) => (
  <button
    type="button"
    className="flex items-center justify-center w-full gap-2 py-1 rounded-md bg-middle-green"
    onClick={onClick}
  >
    <Plus width={24} height={24} stroke="white" />
    <span className="text-white">Epic 생성하기</span>
  </button>
);

export default EpicCreateButton;
