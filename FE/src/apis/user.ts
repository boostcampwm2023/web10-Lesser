import axios from 'axios';

const login = async (code: string, success: () => void, fail: () => void) => {
  axios
    .post(`${import.meta.env.VITE_BASE_URL}/member/login`, { code })
    .then(success)
    .catch(fail);
};

export { login };
