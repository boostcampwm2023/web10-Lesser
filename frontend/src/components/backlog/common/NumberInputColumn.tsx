interface NumberInputColumnProps {
  updating: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  value: number | null;
  onKeyUp: (event: React.KeyboardEvent) => void;
}

const NumberInputColumn = ({
  updating,
  inputRef,
  value,
  onKeyUp,
}: NumberInputColumnProps) => {
  if (updating) {
    return (
      <input
        className="w-full min-w-[1.75rem] no-arrows text-right focus:outline-none rounded-sm bg-gray-200 hover:cursor-pointer"
        type="number"
        ref={inputRef}
        defaultValue={value === null ? "" : value}
        onKeyUp={onKeyUp}
      />
    );
  }

  return <span className="w-full text-right">{value}</span>;
};

export default NumberInputColumn;
