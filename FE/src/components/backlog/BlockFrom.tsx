interface BlockFormProps {
  formRef: React.RefObject<HTMLFormElement>;
  newBlockTitle: string;
  setNewBlockTitle: React.Dispatch<React.SetStateAction<string>>;
  formVisibility: boolean;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleAddBlock: () => void;
  buttonText: string;
}

const BlockForm = ({
  formRef,
  newBlockTitle,
  setNewBlockTitle,
  formVisibility,
  handleFormSubmit,
  handleAddBlock,
  buttonText,
}: BlockFormProps) =>
  formVisibility ? (
    <form ref={formRef} onSubmit={handleFormSubmit}>
      <input
        type="text"
        placeholder={`제목을 입력하세요`}
        value={newBlockTitle}
        onChange={(e) => setNewBlockTitle(e.target.value)}
      />
      <button className="border px-8" type="submit">
        {buttonText}
      </button>
    </form>
  ) : (
    <button className="border px-8" type="submit" onClick={handleAddBlock}>
      {buttonText}
    </button>
  );

export default BlockForm;
