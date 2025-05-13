import axios from 'axios';

export const getLicenses = async () => {
  const response = await axios.get('/api/licenseauthorities');
  return response.data;
};
