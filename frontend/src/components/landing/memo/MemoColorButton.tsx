import { MemoColorStyle, MemoColorType } from "../../../types/common/landing";

interface MemoColorButtonProps {
  id: number;
  active: Boolean;
  color: MemoColorType;

  emitMemoColorUpdateEvent: (id: number, color: MemoColorType) => void;
}

const MemoColorButton = ({
  id,
  active,
  color,

  emitMemoColorUpdateEvent,
}: MemoColorButtonProps) => {
  const borderStyle = active
    ? "border-blue-500 border-2"
    : "border-white border hover:border-blue-500 hover:border-2";

  const handleOnClick = () => {
    emitMemoColorUpdateEvent(id, color);
  };

  return (
    <button
      className={`w-5 h-5 rounded-full hover:scale-125 transition-all ease-in-out ${borderStyle} ${MemoColorStyle[color]}`}
      onClick={handleOnClick}
    />
  );
};

export default MemoColorButton;
