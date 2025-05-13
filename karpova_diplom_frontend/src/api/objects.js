import axios from 'axios';

export const getObjects = async () => {
  const response = await axios.get('/api/objects');
  return response.data;
};
