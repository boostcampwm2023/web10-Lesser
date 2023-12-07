import { useQuery } from '@tanstack/react-query';
import { api } from '../../../apis/api';
import { Task } from '../../../types/sprint';

interface Sprint {
  sprintId: number;
  sprintTitle: string;
  sprintGoal: string;
  sprintStartDate: string;
  sprintEndDate: string;
  sprintEnd: boolean;
  sprintModal: boolean;
  taskList: Task[];
}

const useGetProgressSprint = (projectId: number) =>
  useQuery<Sprint>({
    queryKey: ['sprint'],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/sprints/progress`);
      return response.data;
    },
  });

export default useGetProgressSprint;
