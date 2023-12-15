import { API_URL } from '../../constants/constants';
import { api } from '../api';

const fetchGetUsername = async (username: string) => {
  try {
    const response = await api.get(API_URL.MEMBER_SEARCH, { params: { username } });
    return { status: 200, data: { userId: response.data[0].id, userName: response.data[0].username } };
  } catch {
    return { status: 404, data: { userId: -1, userName: '' } };
  }
};

export default fetchGetUsername;
