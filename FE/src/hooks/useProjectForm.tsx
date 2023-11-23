import { useState, useRef } from 'react';
import { api } from '../apis/api';
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
      // 임시 backlog 연결
      navigate('/backlog');
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
    setProjectName(projectNameRef.current.value);
    setProcess((process) => process + 1);
    projectNameRef.current.value = '';
  };
  const handleSubmitButtonClick = () => {
    if (!projectSubjectRef.current) {
      return;
    }
    const projectSubject = projectSubjectRef.current.value;
    fetchProjectPost({ name: projectName, subject: projectSubject }, navigate);
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
