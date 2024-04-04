import { useMutation } from "@tanstack/react-query";
import { postCreateProject } from "../../../apis/api/projectAPI";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../../constants/path";

const usePostCreateProject = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body: { title: string; subject: string }) =>
      postCreateProject(body),
    onSuccess: () => {
      navigate(ROUTER_URL.PROJECTS);
    },
  });
};

export default usePostCreateProject;
