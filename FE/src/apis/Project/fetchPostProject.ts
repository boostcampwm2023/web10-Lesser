import { API_URL } from '../../constants/constants';
import { api } from '../api';

interface fetchPostProjectProps {
  name: string;
  subject: string;
  memberList: number[];
}

const fetchPostProject = async (body: fetchPostProjectProps) => {
  const response = await api.post(API_URL.PROJECT, body);
  return response.data.id;
};

export default fetchPostProject;
