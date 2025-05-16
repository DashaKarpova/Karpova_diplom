import axios from 'axios';

export const getResources = async () => {
const response = await axios.get('/api/resource');
return response.data;
};