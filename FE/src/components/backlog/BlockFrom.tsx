import CheckIcon from './../../assets/icons/CheckIcon';
import ClosedIcon from './../../assets/icons/ClosedIcon';
import { useState } from 'react';

interface BlockFormProps {
  initialTitle: string;
  placeholder: string;
  formRef: React.RefObject<HTMLFormElement>;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const BlockForm = ({ initialTitle, placeholder, formRef, handleFormSubmit, onClose }: BlockFormProps) => {
  const [blockTitle, setBlockTitle] = useState<string>(initialTitle);

  return (
    <form className="flex w-full gap-1 py-1" ref={formRef} onSubmit={handleFormSubmit} name="blockForm">
      <input
        className="w-full border outline-starbucks-green font-normal"
        type="text"
        placeholder={placeholder}
        value={blockTitle}
        onChange={(e) => {
          setBlockTitle(e.target.value);
        }}
      />
      <div className="flex gap-1">
        <button type="submit">
          <CheckIcon color="text-true-white" backgroundColor="bg-starbucks-green" />
        </button>
        <button type="button" onClick={onClose}>
          <ClosedIcon color="text-true-white" backgroundColor="bg-error-red" />
        </button>
      </div>
    </form>
  );
};

export default BlockForm;
