import { MemoColor } from "../../../types/common/landing";

interface MemoColorButtonProps {
  active: Boolean;
  color: MemoColor;
}

const MemoColorButton = ({ active, color }: MemoColorButtonProps) => {
  const borderStyle = active
    ? "border-blue-500 border-2"
    : "border-white border hover:border-blue-500 hover:border-2";

  const colorStyle = `bg-[${color}]`;

  return (
    <button
      className={`w-5 h-5 rounded-full hover:scale-125 transition-all ease-in-out ${borderStyle} ${colorStyle}`}
    />
  );
};

export default MemoColorButton;
