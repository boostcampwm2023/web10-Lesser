import { useQuery } from '@tanstack/react-query';
import { api } from '../../../apis/api';
import { ReturnedSprint, Sprint, TaskGroup, UserFilter } from '../../../types/sprint';
import structureTaskList from '../../../utils/structureTaskList';
import { AxiosError } from 'axios';

interface UseGetProgressSprintParams {
  projectId: number;
  userToFilter: UserFilter;
  taskGroup: TaskGroup;
}

const useGetProgressSprint = ({ projectId, userToFilter, taskGroup }: UseGetProgressSprintParams) =>
  useQuery<Sprint, AxiosError, ReturnedSprint>({
    queryKey: ['sprint'],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/sprints/progress`);
      const data = { ...response.data, boardTask: structureTaskList(response.data.taskList, userToFilter, taskGroup) };
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });

export default useGetProgressSprint;
