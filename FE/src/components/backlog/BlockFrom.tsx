import CheckIcon from './../../assets/icons/CheckIcon';
import ClosedIcon from './../../assets/icons/ClosedIcon';
import { useState } from 'react';

interface BlockFormProps {
  initialTitle: string;
  formRef: React.RefObject<HTMLFormElement>;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const BlockForm = ({ initialTitle, formRef, handleFormSubmit, onClose }: BlockFormProps) => {
  const [blockTitle, setBlockTitle] = useState<string>(initialTitle);
  const placeholder = initialTitle
    ? '이 기능에서 사용자는 어떤 것을 할 수 있나요? 예시) 사용자는 로그인 할 수 있다'
    : '어떤 기능을 계획할 예정인가요? 예시) 회원 기능';
  return (
    <form className="flex w-full gap-1 py-1" ref={formRef} onSubmit={handleFormSubmit} name="blockForm">
      <input
        className="w-full border outline-starbucks-green"
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
