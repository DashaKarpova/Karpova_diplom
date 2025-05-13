import axios from 'axios';

export const getContractors = async () => {
  const response = await axios.get('/api/contractors');
  return response.data;
};
