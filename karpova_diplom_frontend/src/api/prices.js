import axios from 'axios';

export const getPrices = async () => {
  const response = await axios.get('/api/prices');
  return response.data;
};
