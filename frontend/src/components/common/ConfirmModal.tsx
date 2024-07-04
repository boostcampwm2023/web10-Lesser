interface ConfirmModalProps {
  title: string;
  body: string;
  confirmText: string;
  cancelText: string;
  confirmColor: string;
  cancelColor: string;
  onConfirmButtonClick: () => void;
  onCancelButtonClick: () => void;
}

const ConfirmModal = ({
  title,
  body,
  confirmText,
  cancelText,
  confirmColor,
  cancelColor,
  onConfirmButtonClick,
  onCancelButtonClick,
}: ConfirmModalProps) => (
  <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-screen h-screen bg-black bg-opacity-30">
    <div className="flex flex-col gap-2 px-4 py-6 rounded-md w-[30rem] bg-white shadow-box">
      <h1 className="text-m">{title}</h1>
      <p>{body}</p>
      <div className="flex items-center self-end gap-2 text-white">
        <button
          className={`w-fit py-1 px-2 rounded-md bg-[${cancelColor}]`}
          onClick={onCancelButtonClick}
          type="button"
          style={{ backgroundColor: cancelColor }}
        >
          {cancelText}
        </button>
        <button
          className={`w-fit py-1 px-2 rounded-md bg-[${confirmColor}]`}
          onClick={onConfirmButtonClick}
          type="button"
          style={{ backgroundColor: confirmColor }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
