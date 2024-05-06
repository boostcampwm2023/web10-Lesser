import { MemoColor, MemoColorString } from "../../../types/common/landing";

interface MemoColorButtonProps {
  active: Boolean;
  color: MemoColorString;
  changeMemoColor: (color: MemoColorString) => void;
}

const MemoColorButton = ({
  active,
  color,
  changeMemoColor,
}: MemoColorButtonProps) => {
  const borderStyle = active
    ? "border-blue-500 border-2"
    : "border-white border hover:border-blue-500 hover:border-2";

  const handleOnClick = () => {
    changeMemoColor(color);
  };

  return (
    <button
      className={`w-5 h-5 rounded-full hover:scale-125 transition-all ease-in-out ${borderStyle} ${MemoColor[color]}`}
      onClick={handleOnClick}
    />
  );
};

export default MemoColorButton;
