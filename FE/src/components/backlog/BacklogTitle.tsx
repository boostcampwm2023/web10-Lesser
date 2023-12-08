import CheckIcon from '../../assets/icons/CheckIcon';
import ClosedIcon from '../../assets/icons/ClosedIcon';
import EditIcon from '../../assets/icons/EditIcon';
import Trashbin from '../../assets/icons/TrashbinIcon';
import useToggleButton from '../../hooks/pages/backlog/useToggleButton';
import useUpdateBacklog from '../../hooks/pages/backlog/useUpdateBacklog';
import { useModal } from '../../modal/useModal';
import BacklogDeleteModal from './Modal/BacklogDeleteModal';

const BacklogTitle = ({ title, id, url }: { title: string; id: number; url: string }) => {
  const { postForm, postFormRef, toggleButton, getPostTitle } = useToggleButton();
  const getBody = () => {
    return { id: id, title: getPostTitle() };
  };
  const { handleClick } = useUpdateBacklog(url, getBody, toggleButton);
  const { open, close } = useModal();

  return (
    <>
      {!postForm ? (
        <div className="group w-full flex gap-1 hover:underline items-center">
          <button onClick={toggleButton}>{title}</button>
          <div className="hidden group-hover:flex">
            <button onClick={toggleButton}>
              <EditIcon color="text-house-green" size={20} />
            </button>
            <button
              onClick={() => {
                open(<BacklogDeleteModal id={id} url={url} close={close} />);
              }}
            >
              <Trashbin color="text-error-red" size={20} />
            </button>
          </div>
        </div>
      ) : (
        <form ref={postFormRef} className="flex w-full gap-1 py-1" onSubmit={handleClick}>
          <input type="text" className="w-full border outline-starbucks-green font-normal ps-2" defaultValue={title} />
          <button type="submit">
            <CheckIcon color="text-true-white" backgroundColor="bg-starbucks-green" />
          </button>
          <button type="button" onClick={toggleButton}>
            <ClosedIcon color="text-true-white" backgroundColor="bg-error-red" />
          </button>
        </form>
      )}
    </>
  );
};

export default BacklogTitle;
