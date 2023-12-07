import { useQuery } from '@tanstack/react-query';
import { fetchGetMyProjects } from '../../../apis/project';

const useGetMyProjects = () =>
  useQuery({
    queryKey: ['myProjects'],
    queryFn: fetchGetMyProjects,
    refetchOnWindowFocus: false,
  });

export default useGetMyProjects;
