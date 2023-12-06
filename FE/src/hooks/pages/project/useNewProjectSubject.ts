import { useRef, useState } from 'react';

const useNewProjectSubjectProps = (setNextProcess: () => void) => {
  const [projectSubject, setProjectSubject] = useState<string>('');
  const projectSubjectRef = useRef<HTMLInputElement>(null);

  const handleSubjectButtonClick = () => {
    if (!projectSubjectRef.current) return;
    if (!projectSubjectRef.current.value) {
      window.alert('주제를 입력해주세요');
      return;
    }
    setProjectSubject(projectSubjectRef.current.value);
    setNextProcess();
    projectSubjectRef.current.value = '';
  };

  return { projectSubject, projectSubjectRef, handleSubjectButtonClick };
};

export default useNewProjectSubjectProps;
