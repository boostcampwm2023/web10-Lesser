import { useQuery } from '@tanstack/react-query';
import { fetchGetMyProjects } from '../../../apis/Project';

const useGetMyProjects = () =>
  useQuery({
    queryKey: ['myProjects'],
    queryFn: fetchGetMyProjects,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

export default useGetMyProjects;
