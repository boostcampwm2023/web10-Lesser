import { useState, useRef } from 'react';

const useProjectForm = () => {
  const [process, setProcess] = useState<number>(0);
  const [projectName, setProjectName] = useState<string>('');
  const projectNameRef = useRef<HTMLInputElement>(null);
  const projectSubjectRef = useRef<HTMLInputElement>(null);
  const handleNextButtonClick = () => {
    if (!projectNameRef.current) {
      return;
    }
    setProjectName(projectNameRef.current.value);
    setProcess((process) => (!process ? process + 1 : 0));
    projectNameRef.current.value = '';
  };
  const handleSubmitButtonClick = () => {
    if (!projectSubjectRef.current) {
      return;
    }
    // post 코드 작성 예정
    console.log(projectName, projectSubjectRef.current.value);
  };

  return {
    process,
    handleNextButtonClick,
    handleSubmitButtonClick,
    projectNameRef,
    projectSubjectRef,
  };
};

export default useProjectForm;
