import { useRef, useState } from 'react';

const useNewProjectTitle = (setNextProcess: () => void) => {
  const [projectTitle, setProjectTitle] = useState<string>('');
  const projectTitleRef = useRef<HTMLInputElement>(null);

  const handleTitleButtonClick = () => {
    if (!projectTitleRef.current) return;
    if (!projectTitleRef.current.value) {
      window.alert('이름을 입력해주세요');
      return;
    }
    setProjectTitle(projectTitleRef.current.value);
    setNextProcess();
  };

  return { projectTitle, projectTitleRef, handleTitleButtonClick };
};

export default useNewProjectTitle;
