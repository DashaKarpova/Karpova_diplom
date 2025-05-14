// api/objects.js
import axios from 'axios';

export const getObjects = async () => {
  const response = await axios.get('/api/objects'); // Подставьте правильный путь
  return response.data;
};
