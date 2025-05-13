import axios from 'axios';

export const login = async (login, password) => {
  const response = await axios.post('/api/auth/login', { login, password });
  return response.data;
};
