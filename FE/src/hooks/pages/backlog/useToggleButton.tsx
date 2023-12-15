import { useEffect, useRef, useState } from 'react';

const useToggleButton = () => {
  const [postForm, setPostForm] = useState<Boolean>(false);
  const postFormRef = useRef<HTMLFormElement>(null);
  const toggleButton = () => {
    setPostForm((postForm) => !postForm);
  };

  const handleClickOutside = ({ target }: MouseEvent) => {
    if (postFormRef.current && !postFormRef.current.contains(target as Node)) {
      toggleButton();
    }
  };

  const getPostTitle = () => {
    return postFormRef.current?.querySelector('input')?.value ?? '';
  };

  useEffect(() => {
    addEventListener('mousedown', handleClickOutside);

    return () => {
      removeEventListener('mousedown', handleClickOutside);
    };
  });

  return { postForm, toggleButton, postFormRef, getPostTitle };
};

export default useToggleButton;
