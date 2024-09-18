import { ChangeEvent } from "react";

interface InformationInputProps {
  label: string;
  inputId: string;
  inputValue: string;
  errorMessage: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InformationInput = ({
  label,
  inputId,
  inputValue,
  errorMessage,
  onChange,
}: InformationInputProps) => (
  <div className="flex w-full gap-6 mb-5">
    <label
      className="min-w-[6.125rem] text-xs font-semibold text-middle-green"
      htmlFor={inputId}
    >
      {label}
    </label>
    <div>
      <input
        className="w-[60.3rem] mb-1 h-10 border-[2px] border-text-gray rounded-lg focus:outline-middle-green px-1 hover:cursor-pointer"
        type="text"
        id={inputId}
        autoComplete="off"
        value={inputValue}
        onChange={onChange}
      />
      <p className="text-xxxs text-error-red">{errorMessage}</p>
    </div>
  </div>
);

export default InformationInput;
