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
    <p
      className="min-w-[6.875rem]"
      style={{ textShadow: "8px 8px 25px 0px #00000051" }}
    >
      {children}
    </p>
  </button>
);

export default NextStepButton;
