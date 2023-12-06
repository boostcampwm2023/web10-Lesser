import { API_URL } from '../../constants/constants';
import { api } from '../api';

interface fetchPostProjectProps {
  name: string;
  subject: string;
  memberList: number[];
}

const fetchPostProject = async (body: fetchPostProjectProps) => {
  const response = await api.post(API_URL.PROJECT, body);
  console.log(response);
  return response;
};

export default fetchPostProject;
