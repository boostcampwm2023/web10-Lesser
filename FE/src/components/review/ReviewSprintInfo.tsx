interface ReviewSprintInfoProps {
  label: string;
  content: string;
}
const ReviewSprintInfo = ({ label, content }: ReviewSprintInfoProps) => (
  <p className="flex w-full items-center gap-8">
    <span className="w-[5.625rem] font-bold text-r">{label}</span>
    <span className="flex-1 font-medium">{content}</span>
  </p>
);

export default ReviewSprintInfo;
