import { useQuery } from '@tanstack/react-query';
import { api } from '../../../apis/api';
import { ReturnedSprint, Sprint } from '../../../types/sprint';
import structureTaskList from '../../../utils/structureTaskList';
import { AxiosError } from 'axios';

const useGetProgressSprint = (projectId: number) =>
  useQuery<Sprint, AxiosError, ReturnedSprint>({
    queryKey: ['sprint'],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/sprints/progress`);
      const data = { ...response.data, boardTask: structureTaskList(response.data.taskList) };
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });

export default useGetProgressSprint;
