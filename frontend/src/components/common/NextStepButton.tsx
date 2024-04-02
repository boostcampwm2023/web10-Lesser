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
    className="text-[#68790E] font-bold text-3xl self-end"
  >
    <span style={{ textShadow: "8px 8px 25px 0px #00000051" }}>{children}</span>
  </button>
);

export default NextStepButton;
