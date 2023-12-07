import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../apis/api';
import { useSelectedProjectState } from '../../../stores';

interface BacklogDeleteModalProps {
  id: number;
  url: string;
  close: () => void;
}

const BacklogDeleteModal = ({ id, url, close }: BacklogDeleteModalProps) => {
  const queryClient = useQueryClient();
  const projectId = useSelectedProjectState((state) => state.id);
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/backlogs${url}`, { data: { id: id } });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlogs', projectId] });
      queryClient.invalidateQueries({ queryKey: ['backlogs', projectId, 'sprint'] });
    },
  });

  const handleDeleteClick = async () => {
    await mutateAsync();
    close();
  };

  return (
    <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-30 flex justify-center items-center ">
      <div className="bg-white h-[200px] w-[400px] pb-8 pt-16 px-8 flex flex-col justify-between rounded-md border border-light-gray">
        <p className="text-center text-ml font-bold">모든 데이터를 삭제하시겠습니까?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            className="w-[4.5rem] border-2 rounded-md border-starbucks-green px-4 py-1.5 font-bold text-starbucks-green text-s"
          >
            아니오
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-[4.5rem] min-w-18 rounded-md px-4 py-1.5 font-bold text-true-white bg-error-red text-s"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default BacklogDeleteModal;
