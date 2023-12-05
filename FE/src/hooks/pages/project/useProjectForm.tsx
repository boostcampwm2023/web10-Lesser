import { useState, useRef } from 'react';
import { api } from '../../../apis/api';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface projectPostBody {
  name: string;
  subject: string;
}

const fetchProjectPost = ({ name, subject }: projectPostBody, navigate: NavigateFunction) => {
  api
    .post('projects', {
      name,
      subject,
    })
    .then((response) => {
      const projectId = response.data.id;
      const nextRef = projectId ? '/backlog' : '/backlog';
      // 임시 backlog 연결
      navigate(nextRef);
    });
};

const useProjectForm = () => {
  const [process, setProcess] = useState<number>(0);
  const [projectName, setProjectName] = useState<string>('');
  const projectNameRef = useRef<HTMLInputElement>(null);
  const projectSubjectRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handleNextButtonClick = () => {
    if (!projectNameRef.current) {
      return;
    }
    if (!projectNameRef.current.value) {
      window.alert('이름을 입력해주세요');
      return;
    }
    setProjectName(projectNameRef.current.value);
    setProcess((process) => process + 1);
    projectNameRef.current.value = '';
  };
  const handleSubmitButtonClick = () => {
    if (!projectSubjectRef.current) {
      return;
    }
    if (!projectSubjectRef.current.value) {
      window.alert('주제를 입력해주세요');
      return;
    }
    const projectSubject = projectSubjectRef.current.value;
    fetchProjectPost({ name: projectName, subject: projectSubject }, navigate);
  };

  return {
    process,
    projectNameRef,
    projectSubjectRef,
    handleNextButtonClick,
    handleSubmitButtonClick,
  };
};

export default useProjectForm;
