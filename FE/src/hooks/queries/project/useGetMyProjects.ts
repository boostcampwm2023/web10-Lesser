import { useQuery } from '@tanstack/react-query';
import { fetchGetMyProjects } from '../../../apis/project';

const useGetMyProjects = () =>
  useQuery({
    queryKey: ['myProjects'],
    queryFn: fetchGetMyProjects,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

export default useGetMyProjects;
