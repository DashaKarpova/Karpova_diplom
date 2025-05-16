import axios from 'axios';

export const getOperations = async () => {
const response = await axios.get('/api/operation');
return response.data;
};