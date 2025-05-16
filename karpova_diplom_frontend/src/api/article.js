import axios from 'axios';

export const getArticles = async () => {
const response = await axios.get('/api/article');
return response.data;
};