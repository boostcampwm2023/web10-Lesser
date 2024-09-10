import { useModal } from "../../hooks/common/modal/useModal";
import ProjectDeleteModal from "./ProjectDeleteModal";

interface ProjectDeleteSectionProps {
  projectTitle: string;
}

const ProjectDeleteSection = ({ projectTitle }: ProjectDeleteSectionProps) => {
  const { open, close } = useModal(true);
  const handleDeleteButtonClick = () => {
    open(<ProjectDeleteModal {...{ projectTitle, close }} />);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="">
        <p className="text-xs">프로젝트 삭제</p>
        <p className="text-xxs">프로젝트를 삭제한 후 되돌릴 수 없습니다.</p>
      </div>
      <button
        className="h-10 px-2 font-light text-white rounded-lg w-fit bg-error-red text-xxs"
        type="button"
        onClick={handleDeleteButtonClick}
      >
        프로젝트 삭제
      </button>
    </div>
  );
};

export default ProjectDeleteSection;
