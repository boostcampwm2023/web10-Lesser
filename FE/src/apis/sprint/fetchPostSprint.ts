import { SprintCreateBody } from '../../types/sprint';
import { api } from '../api';

const fetchPostSprint = async (body: SprintCreateBody) => {
  const response = await api.post('/sprints', body);
  return response;
};

export default fetchPostSprint;
