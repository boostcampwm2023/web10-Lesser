import { api } from '../api';

const fetchPatchSprintEnd = async (id: number) => {
  const response = await api.patch('/sprints/complete', { id });
  return response;
};

export default fetchPatchSprintEnd;
