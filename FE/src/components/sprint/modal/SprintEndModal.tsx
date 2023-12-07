import { usePatchSprintEnd } from '../../../hooks/queries/sprint';

interface SprintEndModalProps {
  id: number;
  close: () => void;
  projectId: number;
}

const SprintEndModal = ({ id, projectId, close }: SprintEndModalProps) => {
  const { mutateAsync } = usePatchSprintEnd(projectId);

  const handleDeleteClick = async () => {
    await mutateAsync(id);
    close();
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-30 ">
      <div className="bg-white h-[200px] w-[400px] pb-8 pt-16 px-8 flex flex-col justify-between rounded-md border border-light-gray">
        <p className="font-bold text-center text-ml">스프린트를 종료하시겠습니까?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            className="w-[4.5rem] border-2 rounded-md border-starbucks-green px-4 py-1.5 font-bold text-starbucks-green text-s"
          >
            취소
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-[4.5rem] min-w-18 rounded-md px-4 py-1.5 font-bold text-true-white bg-error-red text-s"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintEndModal;
