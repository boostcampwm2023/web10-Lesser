import { useState, useRef } from 'react';

const useProjectForm = () => {
  const [process, setProcess] = useState<number>(0);
  const [projectName, setProjectName] = useState<string>('');
  const [projectSubject, setProjectSubject] = useState<string>('');
  const projectNameRef = useRef<HTMLInputElement>(null);
  const projectSubjectRef = useRef<HTMLInputElement>(null);
  const handleTitleButtonClick = () => {
    if (!projectNameRef.current) return;
    if (!projectNameRef.current.value) {
      window.alert('이름을 입력해주세요');
      return;
    }
    setProjectName(projectNameRef.current.value);
    setProcess((process) => process + 1);
    projectNameRef.current.value = '';
  };

  const handleSubjectButtonClick = () => {
    if (!projectSubjectRef.current) return;
    if (!projectSubjectRef.current.value) {
      window.alert('주제를 입력해주세요');
      return;
    }
    setProjectSubject(projectSubjectRef.current.value);
    setProcess((process) => process + 1);
    projectSubjectRef.current.value = '';
  };

  return {
    process,
    projectName,
    projectSubject,
    projectNameRef,
    projectSubjectRef,
    handleTitleButtonClick,
    handleSubjectButtonClick,
  };
};

export default useProjectForm;
