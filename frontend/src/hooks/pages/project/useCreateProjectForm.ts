import { useState } from "react";
import usePostCreateProject from "../../queries/project/usePostCreateProject";

const useCreateProjectForm = () => {
  const [projectData, setProjectData] = useState({
    title: "",
    subject: "",
  });
  const mutation = usePostCreateProject();

  const handleTitleChange = (title: string) => {
    setProjectData({ ...projectData, title });
  };

  const handleSubjectChange = (subject: string) => {
    setProjectData({ ...projectData, subject });
  };

  const handleCreateButtonClick = async () => {
    mutation.mutate(projectData);
  };

  return {
    projectData,
    handleTitleChange,
    handleSubjectChange,
    handleCreateButtonClick,
  };
};

export default useCreateProjectForm;
