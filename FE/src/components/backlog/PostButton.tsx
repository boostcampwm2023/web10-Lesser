import CheckIcon from '../../assets/icons/CheckIcon';
import ClosedIcon from '../../assets/icons/ClosedIcon';
import PlusIcon from '../../assets/icons/PlusIcon';
import usePostBacklog from '../../hooks/pages/backlog/usePostBacklog';
import useToggleButton from '../../hooks/pages/backlog/useToggleButton';

interface PostButtonProps {
  title: string;
  placeholder: string;
  color: string;
  url: string;
  id: number;
}

const PostButton = ({ title, placeholder, color, url, id }: PostButtonProps) => {
  const { postForm, toggleButton, postFormRef, getPostTitle } = useToggleButton();
  const getBody = () => {
    return { parentId: id, title: getPostTitle() };
  };
  const { handleClick } = usePostBacklog(url, getBody, toggleButton);

  return (
    <>
      {!postForm ? (
        <button
          onClick={toggleButton}
          className={`flex w-full py-1 rounded-md text-center justify-center ${color} font-bold text-true-white`}
        >
          <PlusIcon color="text-true-white" />
          <span>{title}</span>
        </button>
      ) : (
        <form ref={postFormRef} className="flex w-full gap-1 py-1" onSubmit={handleClick}>
          <input
            type="text"
            className="w-full border outline-starbucks-green font-normal ps-2"
            placeholder={placeholder}
          />
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

export default PostButton;
