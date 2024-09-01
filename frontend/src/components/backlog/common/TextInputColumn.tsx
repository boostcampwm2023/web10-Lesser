interface TextInputColumnProps {
  updating: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  value: string;
  onKeyUp: (event: React.KeyboardEvent) => void;
}

const TextInputColumn = ({
  updating,
  inputRef,
  value,
  onKeyUp,
}: TextInputColumnProps) => {
  if (updating) {
    return (
      <input
        className="w-full min-w-[1rem] focus:outline-none rounded-sm bg-gray-200 hover:cursor-pointer"
        type="text"
        ref={inputRef}
        defaultValue={value}
        onKeyUp={onKeyUp}
      />
    );
  }

  return (
    <span title={value} className="w-full truncate hover:cursor-pointer">
      {value}
    </span>
  );
};

export default TextInputColumn;
