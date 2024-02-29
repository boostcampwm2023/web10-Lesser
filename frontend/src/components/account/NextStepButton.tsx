interface NextStepButtonProps {
  onNextButtonClick: () => void;
  children: string | React.ReactNode;
}

const NextStepButton = ({
  onNextButtonClick,
  children,
}: NextStepButtonProps) => (
  <button
    type="button"
    onClick={onNextButtonClick}
    className="text-[#68790E] font-bold text-3xl self-end drop-shadow-box"
  >
    {children}
  </button>
);

export default NextStepButton;
