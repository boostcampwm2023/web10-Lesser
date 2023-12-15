import { api } from '../api';
import { API_URL } from '../../constants/constants';

const fetchGetMyProjects = async () => {
  const response = await api.get(API_URL.PROJECT);
  return response.data;
};

export default fetchGetMyProjects;
