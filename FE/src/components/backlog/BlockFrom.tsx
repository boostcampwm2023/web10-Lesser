import CheckIcon from './../../assets/icons/CheckIcon';
import ClosedIcon from './../../assets/icons/ClosedIcon';

interface BlockFormProps {
  formRef: React.RefObject<HTMLFormElement>;
  newBlockTitle: string;
  setNewBlockTitle: React.Dispatch<React.SetStateAction<string>>;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  currentBlock: 'Epic' | 'Story';
}

const BlockForm = ({
  formRef,
  newBlockTitle,
  setNewBlockTitle,
  handleFormSubmit,
  onClose,
  currentBlock,
}: BlockFormProps) => {
  const placeholder =
    currentBlock === 'Epic'
      ? '어떤 기능을 계획할 예정인가요? 예시) 회원 기능'
      : '이 기능에서 사용자는 어떤 것을 할 수 있나요? 예시) 사용자는 로그인 할 수 있다';
  return (
    <form className="flex w-full gap-1 py-1" ref={formRef} onSubmit={handleFormSubmit}>
      <input
        className="w-full border outline-starbucks-green"
        type="text"
        placeholder={placeholder}
        value={newBlockTitle}
        onChange={(e) => setNewBlockTitle(e.target.value)}
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
