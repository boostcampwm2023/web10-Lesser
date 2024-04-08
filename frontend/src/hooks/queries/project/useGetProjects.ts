import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../../apis/api/projectAPI";
import { ProjectDTO } from "../../../types/DTO/projectDTO";

const useGetProjects = () =>
  useQuery<ProjectDTO[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

export default useGetProjects;
